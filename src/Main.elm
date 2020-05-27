port module Main exposing (main)

-- Add/modify imports if you'd like. ---------------------------------

import Browser
import Html exposing (Html)
import Html.Attributes as Attr
import Html.Events exposing (..)

import String exposing (fromInt, fromFloat, repeat)
import Debug

--import Svg exposing (Svg)
--import Svg.Attributes exposing (..)

import Json.Decode as D
import Collage as C
import Collage.Events as E
import Collage.Render as R
import Color exposing (Color)

import Grid


-- Main Stuff --------------------------------------------------------

main : Program Flags Model Msg
main = 
  Browser.element
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

type alias Model = 
  { mouseLocation : Maybe Coordinate
  , mapHeight : Int
  , mapWidth : Int
  , ground : List Grid.Shape
  , walls  : List Grid.Path
  , editState : Bool
  }

type alias Coordinate = { x:Int, y:Int }


type Msg
  = NullMsg
  | MouseMove (Maybe Coordinate)
  | SwitchState

type alias Flags = ()




-- Ports -------------------------------------------------------------

port receiveMouseMove : ((Maybe Coordinate) -> msg) -> Sub msg

port sendEditState : Bool -> Cmd msg




-- Initialization ----------------------------------------------------

init : Flags -> (Model, Cmd Msg)
init () = (initModel, Cmd.none)

initModel : Model
initModel = 
  { mouseLocation = Nothing
  , mapHeight = 20
  , mapWidth = 20
  , ground = []
  , walls = []
  , editState = True
  }



-- Subscriptions and Updates -----------------------------------------

subscriptions : Model -> Sub Msg
subscriptions model =
  receiveMouseMove MouseMove


update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  NullMsg ->
    (model, Cmd.none)
  MouseMove coord ->
    ( { model | mouseLocation = coord }, Cmd.none )
  SwitchState ->
    if model.editState then
      ( { model | editState = False }, sendEditState False )
    else
      ( { model | editState = True }, sendEditState True )




-- View --------------------------------------------------------------

canvas_attributes : Model -> List (Html.Attribute msg)
canvas_attributes m = [ Attr.style "padding-left" "0" 
                      , Attr.style "padding-right" "0"
                      , Attr.style "margin-left" "auto"
                      , Attr.style "margin-right" "auto"
                      , Attr.width (round (scale (m.mapWidth + 2)))
                      , Attr.height (round (scale (m.mapHeight + 2)))
                      , Attr.style "border" "1px solid red"
                      , Attr.id "myCanvas" ]

button_attributes = [ Attr.style "margin" "0 auto"
                    , Attr.style "display" "block"
                    , Attr.style "margin-top" "15px" ]


view : Model -> Html Msg
view model =
  let
    msg = "DND Map Designer Studio Suite Lite (TM)"
    save_msg = "Right click and select \"Save Image As...\" to save!"
    map = [draw_mouse, draw_ground, draw_grid, draw_bg]
            |> List.map (\f -> f model)
            |> C.group
            |> R.svg
  in
    Html.div [] (
        [ Html.h3 [ Attr.align "center", Attr.style "margin" "15px" ] [ Html.text msg ]
        , Html.div [ Attr.align "center"
                   , Attr.id "map_canvas_container"
                   , Attr.style "display" (if model.editState then "block" else "none") ]
                   [ map ]
        , Html.canvas
            ( [Attr.style "display" (if model.editState then "none" else "block")]
                ++ (canvas_attributes model) ) [ ]
        , Html.button ( (onClick SwitchState) :: button_attributes )
                      [ Html.text (if model.editState then "Save" else "Edit") ]
        ] ++ (
          if model.editState then []
          else
            [ Html.div [ Attr.align "center"
                       , Attr.style "margin-top" "15px"
                       , Attr.style "font-family" "Comic Sans MS" ]
                       -- dude im a graphic design genius
                       [ Html.text save_msg ] ]))



-- Drawing Map Objects -----------------------------------------------

draw_bg : Model -> C.Collage Msg
draw_bg model =
  let
    width  = scale (model.mapWidth  + 2)
    height = scale (model.mapHeight + 2)
  in
  C.rectangle width height
    |> C.filled (C.uniform Color.lightGrey)
    |> C.shift (((width / 2) - (scale 1)), ((height / 2) - (scale 1)))

draw_grid : Model -> C.Collage Msg
draw_grid model =
  let
    grid_style = C.traced (C.solid C.thin (C.uniform Color.darkGray))

    h_grid_lines = (List.range 0 model.mapHeight)
      |> List.map (\y -> C.segment (0, scale y) (scale model.mapWidth, scale y))
      |> List.map grid_style

    v_grid_lines = (List.range 0 model.mapWidth)
      |> List.map (\x -> C.segment (scale x, 0) (scale x, scale model.mapHeight))
      |> List.map grid_style
  in
    h_grid_lines ++ v_grid_lines
      |> C.group

draw_ground : Model -> C.Collage Msg
draw_ground model =
  let
    fill_style = C.uniform (Color.rgba 1 1 1 0.5)
    line_style = C.solid C.thick (C.uniform Color.black)
  in
    List.map (shape_to_collage (fill_style, line_style)) model.ground |> C.group

draw_paths : Model -> C.Collage Msg
draw_paths model = Debug.todo "Draw Paths"

draw_mouse : Model -> C.Collage Msg
draw_mouse model =
  case model.mouseLocation of
    Nothing -> C.filled C.transparent (C.circle 0)
    Just loc ->
      C.circle 10
        |> C.filled (C.uniform Color.red)
        |> C.shift (mouse_to_gridpoint model loc)




-- Converting Grid to Collage ----------------------------------------

scaling_factor = 35

scale : Int -> Float
scale = scale_f << toFloat

scale_f : Float -> Float
scale_f = (*) scaling_factor

scale_gridpoint : Grid.Point -> C.Point
scale_gridpoint = Grid.map scale_f


shape_to_collage : (C.FillStyle, C.LineStyle) -> Grid.Shape -> C.Collage Msg
shape_to_collage (fill, line) shape =
  let
    scale_and_style = List.map scale_gridpoint >> C.polygon >> C.styled (fill, line)
  in
    case shape of
      -- Convert polygons pretty directly
      Grid.Polygon ps -> scale_and_style ps

      -- Draw the outlines, and only fill in the part that isn't in a hole
      -- This is the tricky part...
      Grid.Composite outline holes ->
        C.group <| scale_and_style outline :: List.map scale_and_style holes


mouse_to_gridpoint : Model -> Coordinate -> C.Point
mouse_to_gridpoint model loc =
  let
    xpos = (toFloat loc.x) - (scale 1)
    ypos = (scale <| model.mapHeight + 2) - ((toFloat loc.y) + (scale 1))

    leftBound = (scale -1) + 10
    rightBound = (scale <| model.mapWidth  + 1) - 10
    bottomBound = (scale -1) + 10
    topBound = (scale <| model.mapHeight + 1) - 10
  in
    ( clamp leftBound rightBound xpos, clamp bottomBound topBound ypos )




-- Adding and Removing Shapes ----------------------------------------

add_ground : Grid.Shape -> Model -> Model
add_ground shape model =
  let
    add_shape : List Grid.Shape -> Grid.Shape -> List Grid.Shape
    add_shape shape_list new_shape = case shape_list of
      [] -> [new_shape]
      head::tail ->
        case Grid.union head new_shape of
          Nothing -> head :: add_shape tail new_shape
          Just u  -> add_shape tail u
  in
    {model | ground = add_shape model.ground shape}

add_wall : Grid.Path -> Model -> Model
add_wall path model =
  { model | walls = path :: model.walls }


remove_ground : Grid.Shape -> Model -> Model
remove_ground shape model = model

remove_wall : Grid.Path -> Model -> Model
remove_wall path model = model

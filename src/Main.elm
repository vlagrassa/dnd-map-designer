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
  , ground : List Shape
  , walls  : List Path
  }

type alias Coordinate = { x:Int, y:Int }

type Shape
  = Polygon (List GridPoint)
  | Rect GridPoint GridPoint
  | Donut Shape (List Shape)

type Path = Path (List GridPoint)

type alias GridPoint = (Float, Float)


type Msg
  = NullMsg
  | MouseMove (Maybe Coordinate)

type alias Flags = ()




-- Ports -------------------------------------------------------------

port receiveMouseMove : ((Maybe Coordinate) -> msg) -> Sub msg




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
    ( { model | mouseLocation = coord}, Cmd.none )




-- View --------------------------------------------------------------

view : Model -> Html Msg
view model =
  let
    msg = "Hello World! vinc is a nerd"
    map = [draw_mouse, draw_ground, draw_grid, draw_bg]
            |> List.map (\f -> f model)
            |> C.group
            |> R.svg
  in
    Html.div []
      [ Html.div [Attr.align "center"] [ Html.text msg ]
      , Html.div [ Attr.align "center", Attr.id "map_canvas_container" ]
                 [ map
                 ]
      ]




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

scale_gridpoint : GridPoint -> C.Point
scale_gridpoint = Tuple.mapBoth scale_f scale_f

shape_to_collage : (C.FillStyle, C.LineStyle) -> Shape -> C.Collage Msg
shape_to_collage (fill, line) shape =
  let
    scale_and_style = List.map scale_gridpoint >> C.polygon >> C.styled (fill, line)
  in
    case shape of
      -- Convert polygons pretty directly
      Polygon ps -> scale_and_style ps

      -- Collage polygons are easier to position, so calculate coords and dimensions
      Rect p1 p2 ->
        let
          (x, y)     = map2_gridpoint min p1 p2
          (wid, hei) = map2_gridpoint (\i j -> abs <| i - j) p1 p2
        in
          scale_and_style [(x, y), (x + wid, y), (x + wid, y + hei), (x, y + hei)]

      -- Draw the outlines, and only fill in the part that isn't in a hole
      Donut outline holes ->
        -- TODO - Figure out what needs to go here
        shape_to_collage (fill, line) outline
        --scale_make outline :: (List.map scale_make holes) |> C.group

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



map_gridpoint : (Float -> Float) -> GridPoint -> GridPoint
map_gridpoint f = Tuple.mapBoth f f

map2_gridpoint : (Float -> Float -> Float) -> GridPoint -> GridPoint -> GridPoint
map2_gridpoint f p1 p2 =
  let
    xpos = f (Tuple.first p1) (Tuple.first p2)
    ypos = f (Tuple.second p1) (Tuple.second p2)
  in
    (xpos, ypos)



-- Adding and Removing Shapes ----------------------------------------

add_ground : Shape -> Model -> Model
add_ground shape model =
  let
    add_shape : List Shape -> Shape -> List Shape
    add_shape shape_list new_shape = case shape_list of
      [] -> [new_shape]
      head::tail ->
        case union head new_shape of
          Nothing -> head :: add_shape tail new_shape
          Just u  -> add_shape tail u
  in
    {model | ground = add_shape model.ground shape}

add_wall : Path -> Model -> Model
add_wall path model =
  { model | walls = path :: model.walls }


remove_ground : Shape -> Model -> Model
remove_ground shape model = model

remove_wall : Path -> Model -> Model
remove_wall path model = model



-- If two shapes overlap, return their union; if not, return Nothing
union : Shape -> Shape -> Maybe Shape
union a b = Nothing


-- If two shapes overlap, return their intersection; if not, return Nothing
intersection : Shape -> Shape -> Maybe Shape
intersection a b = Nothing

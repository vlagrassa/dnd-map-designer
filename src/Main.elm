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
  { mouseLocation : Coordinate
  , mapHeight : Int
  , mapWidth : Int
  , shapes : List MapShape
  }

type alias Coordinate = { x:Int, y:Int }

type alias MapShape =
  { shape : Shape
  , style : MapStyle
  }

type Shape
  = Polygon (List GridPoint)

type alias GridPoint = (Int, Int)

type MapStyle
  = Wall
  | Ground


type Msg
  = NullMsg
  | MouseMove Coordinate

type alias Flags = ()




-- Ports -------------------------------------------------------------

port receiveMouseMove : (Coordinate -> msg) -> Sub msg




-- Initialization ----------------------------------------------------

init : Flags -> (Model, Cmd Msg)
init () = (initModel, Cmd.none)

initModel : Model
initModel = 
  { mouseLocation = { x = 0, y = 0 }
  , mapHeight = 20
  , mapWidth = 20
  , shapes = []
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
    map = [draw_mouse, draw_shapes, draw_grid, draw_bg]
            |> List.map (\f -> f model)
            |> C.group
            |> R.svg
  in
    Html.div []
      [ Html.div [Attr.align "center"] [ Html.text msg ]
      , Html.div [ Attr.align "center", Attr.id "map_canvas" ]
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
    grid_style = C.traced (C.solid C.thin (C.uniform Color.darkGrey))

    h_grid_lines = (List.range 0 model.mapHeight)
      |> List.map (\y -> C.segment (0, scale y) (scale model.mapWidth, scale y))
      |> List.map grid_style

    v_grid_lines = (List.range 0 model.mapWidth)
      |> List.map (\x -> C.segment (scale x, 0) (scale x, scale model.mapHeight))
      |> List.map grid_style
  in
    h_grid_lines ++ v_grid_lines
      |> C.group

draw_shapes : Model -> C.Collage Msg
draw_shapes model =
  let
    make_collage shape = case shape.style of
      Wall   -> C.filled (C.uniform Color.black) <| convert_shape shape.shape
      Ground -> C.filled (C.uniform Color.white) <| convert_shape shape.shape
  in
    model.shapes
      |> List.map make_collage
      |> C.group


draw_mouse : Model -> C.Collage Msg
draw_mouse model =
  C.circle 10
    |> C.filled (C.uniform Color.red)
    |> C.shift (mouse_to_gridpoint model)




-- Converting Grid to Collage ----------------------------------------

scaling_factor = 35

scale : Int -> Float
scale = (*) scaling_factor << toFloat

scale_gridpoint : GridPoint -> C.Point
scale_gridpoint = Tuple.mapBoth scale scale

convert_shape : Shape -> C.Shape
convert_shape shape =
  case shape of
    Polygon ps -> C.polygon <| List.map scale_gridpoint ps

mouse_to_gridpoint : Model -> C.Point
mouse_to_gridpoint model =
  let
    xpos = (toFloat model.mouseLocation.x) - (scale 1)
    ypos = (scale <| model.mapHeight + 2) - ((toFloat model.mouseLocation.y) + (scale 1))

    leftBound = (scale -1) + 10
    rightBound = (scale <| model.mapWidth  + 1) - 10
    bottomBound = (scale -1) + 10
    topBound = (scale <| model.mapHeight + 1) - 10
  in
    ( clamp leftBound rightBound xpos, clamp bottomBound topBound ypos )


module Main exposing (main)

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
  | MouseMove Int Int

type alias Flags = ()



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
subscriptions model = Sub.none


update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  NullMsg ->
    (model, Cmd.none)
  MouseMove xpos ypos ->
    ( { model | mouseLocation = { x = xpos, y = ypos }}, Cmd.none )


setMouseLocation : C.Point -> Msg
setMouseLocation p =
  MouseMove (floor (Tuple.first p)) (floor (Tuple.second p))




-- View --------------------------------------------------------------

view : Model -> Html Msg
view model =
  let
    msg = "Hello World! vinc is a nerd"
    rect = C.rectangle 900 600
            |> C.filled (C.uniform Color.lightGrey)
            |> E.onMouseMove setMouseLocation
            |> R.svg
    map = [draw_shapes, draw_grid, draw_bg]
            |> List.map (\f -> f model)
            |> C.group
            |> E.onMouseMove setMouseLocation
            |> R.svg
    mouse = make_mouse model
  in
    Html.div []
      [ Html.div [Attr.align "center"] [ Html.text msg ]
      , Html.div [ Attr.align "center" ]
                 [ map
                 , mouse
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


make_mouse : Model -> Html Msg
make_mouse model =
  let
    pointer = C.circle 10
      |> C.filled (C.uniform Color.red)
      |> E.onMouseMove setMouseLocation
      |> R.svg

    top_dist =  (fromInt (model.mouseLocation.y - 10)) ++ "px"
    left_dist = (fromInt (model.mouseLocation.x - 10)) ++ "px"
  in
    Html.div [ Attr.style "position" "absolute"
             , Attr.style "top"  top_dist
             , Attr.style "left" left_dist
             ]
             [ pointer ]




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


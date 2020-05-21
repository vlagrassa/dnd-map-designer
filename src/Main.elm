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
  { mouseLocation : Coordinate }

type alias Coordinate = { x:Int, y:Int }

type Msg
  = NullMsg
  | MouseMove Int Int

type alias Flags = ()



-- Initialization ----------------------------------------------------

init : Flags -> (Model, Cmd Msg)
init () = (initModel, Cmd.none)

initModel : Model
initModel = 
  { mouseLocation = { x = 0, y = 0 } }



-- Subscriptions and Updates -----------------------------------------

subscriptions : Model -> Sub Msg
subscriptions model = Sub.none


update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  NullMsg -> (model, Cmd.none)
  MouseMove xpos ypos -> ( { mouseLocation = { x = xpos, y = ypos }}, Cmd.none )


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
    circ = C.circle 10
            |> C.filled (C.uniform Color.red)
            |> R.svg
  in
    Html.div []
      [ Html.div [Attr.align "center"] [ Html.text msg ]
      , Html.div [ Attr.align "center" ]
                 [ rect
                 , Html.div [ Attr.style "position" "absolute"
                            , Attr.style "top" ((fromInt model.mouseLocation.y) ++ "px")
                            , Attr.style "left" ((fromInt model.mouseLocation.x) ++ "px") ]
                            [ circ ] ] ]




-- Other -------------------------------------------------------------

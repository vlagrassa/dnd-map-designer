module Main exposing (main)

-- Add/modify imports if you'd like. ---------------------------------

import Browser
import Html exposing (Html)
import Html.Attributes as Attr
import Html.Events exposing (onClick)

import String exposing (fromInt, fromFloat, repeat)
import Debug

--import Svg exposing (Svg)
--import Svg.Attributes exposing (..)



-- Main Stuff --------------------------------------------------------

main : Program Flags Model Msg
main = 
  Browser.element
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

type alias Model = {}

type Msg = NullMsg

type alias Flags = ()



-- Initialization ----------------------------------------------------

init : Flags -> (Model, Cmd Msg)
init () = (initModel, Cmd.none)

initModel : Model
initModel = {}



-- Subscriptions and Updates -----------------------------------------

subscriptions : Model -> Sub Msg
subscriptions model = Sub.none


update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  NullMsg -> (model, Cmd.none)
  


-- View --------------------------------------------------------------

view : Model -> Html Msg
view model =
  let
    msg = "Hello World!"
  in
    Html.div [Attr.align "center"] [ Html.text msg ]




-- Other -------------------------------------------------------------

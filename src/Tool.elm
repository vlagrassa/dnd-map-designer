module Tool exposing (..)

import Html exposing (Html)
import Color

type Tool
  = LockedPen
  | FreeformPen
  | LockedAutofill
  | FreeformAutofill
  | Rectangle
  | Line


toTool : String -> Maybe Tool
toTool s =
  case s of
    "Locked Pen" -> Just LockedPen
    "Pen" -> Just FreeformPen
    "Locked Autofill Pen" -> Just LockedAutofill
    "Autofill Pen" -> Just FreeformAutofill
    "Rectangle" -> Just Rectangle
    "Line" -> Just Line
    _ -> Nothing


-- for the selection element in Main.view
toolOptions = List.map (\s -> Html.option [] [Html.text s])
                       [ "Pen"
                       , "Locked Pen"
                       , "Autofill Pen"
                       , "Locked Autofill Pen"
                       , "Rectangle"
                       , "Line" ]


type PenColor
  = Red
  | Orange
  | Yellow
  | Green
  | Blue
  | Purple
  | Black
  | White
  | LightGray
  | Gray

toPenColor : String -> Maybe PenColor
toPenColor s =
  case s of
    "Red" -> Just Red
    "Orange" -> Just Orange
    "Yellow" -> Just Yellow
    "Green" -> Just Green
    "Blue" -> Just Blue
    "Purple" -> Just Purple
    "Black" -> Just Black
    "White" -> Just White
    "Gray" -> Just Gray
    _ -> Nothing


penColorOptions = List.map (\s -> Html.option [] [Html.text s])
                           [ "Black"
                           , "Gray"
                           , "Red"
                           , "Orange"
                           , "Yellow"
                           , "Green"
                           , "Blue"
                           , "Purple"
                           , "White" ]

convertColor : PenColor -> Color.Color
convertColor c =
  case c of
    Red -> Color.red
    Orange -> Color.orange
    Yellow -> Color.yellow
    Green -> Color.green
    Blue -> Color.blue
    Purple -> Color.purple
    Black -> Color.black
    White -> Color.white
    LightGray -> Color.lightGray
    Gray -> Color.darkGray

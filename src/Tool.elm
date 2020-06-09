module Tool exposing (..)

import Html.Styled as Html exposing (Html)
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



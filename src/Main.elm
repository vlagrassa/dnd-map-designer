port module Main exposing (main)

-- Add/modify imports if you'd like. ---------------------------------

import Browser
import Html exposing (Html)
import Html.Attributes as Attr
import Html.Events exposing (..)

import String exposing (fromInt, fromFloat, repeat)
import Debug

import Collage as C
import Collage.Layout as L
import Collage.Events as E
import Collage.Render as R
import Color exposing (Color)

import Grid
import Grid.Json
import Tool

import Json.Encode as Encode

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
  , mouseDown : Bool
  , tool : Tool.Tool
  }

type alias Coordinate = { x:Int, y:Int }

type Msg
  = NullMsg
  | MouseMove (Maybe Coordinate)
  | SwitchState
  | MouseUpDown Bool
  | SwitchTool Tool.Tool
  | ClearBoard
  | RequestMapNames
  | MapNames (List String)
  | RequestMap String
  | LoadMap (Maybe Grid.Shape)
  | UploadMap Encode.Value

type alias Flags = ()




-- Ports -------------------------------------------------------------

port receiveMouseMove : ((Maybe Coordinate) -> msg) -> Sub msg

port receiveMouseUpDown : (Bool -> msg) -> Sub msg

port sendEditState : Bool -> Cmd msg

port uploadMap : Encode.Value -> Cmd msg

port requestMapNames : () -> Cmd msg
port receiveMapNames : (List String -> msg) -> Sub msg

port requestMap : String -> Cmd msg
port receiveMap : (Encode.Value -> msg) -> Sub msg




-- Initialization ----------------------------------------------------

init : Flags -> (Model, Cmd Msg)
init () = (initModel, Cmd.none)

initModel : Model
initModel = 
  { mouseLocation = Nothing
  , mapHeight = 20
  , mapWidth = 25
  , ground = [ ]
  , walls = [ ]
  , editState = True
  , mouseDown = False
  , tool = Tool.FreeformPen
  }



-- Subscriptions and Updates -----------------------------------------

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch
    [ receiveMouseMove MouseMove
    , receiveMouseUpDown MouseUpDown
    , receiveMapNames MapNames
    ]


update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  NullMsg ->
    (model, Cmd.none)

  -- MouseMove handles updating mouseLocation and all drawing
  MouseMove coord ->
    let
      toGrid = case model.tool of
                 Tool.FreeformAutofill -> jsToGrid model
                 Tool.FreeformPen -> jsToGrid model
                 _ -> jsToGridLocked model
      ml = model.mouseLocation
      ws = model.walls
      g = model.ground
      t = model.tool
    in
      ( { model | mouseLocation = coord

                , walls = -- update walls for drawing paths and incomplete shapes
                   case t of

                    Tool.Line ->
                      if model.mouseDown
                      then case (ws, ml) of
                        ([], Just loc) ->
                          [ Grid.makeLinePts (toGrid loc) (toGrid loc) ]
                        (hd::tl, Just loc) ->
                          case (Grid.lineOrigin hd) of
                            Just o ->
                              (Grid.makeLinePts o (toGrid loc))::tl
                            Nothing ->
                              (Grid.makeLinePts (toGrid loc) (toGrid loc))::ws
                        _ -> ws
                      else ws

                    Tool.Rectangle -> ws

                    _ -> if model.mouseDown
                         then case (ws, ml) of
                               ([], Just loc) ->
                                  [ Grid.Path [(toGrid loc)] ]
                               (hd::tl, Just loc) ->
                                  (Grid.addPointIfBeyond 0.1 (toGrid loc) hd)::tl
                               _ -> ws
                         else ws

                , ground = -- update ground for drawing rectangles
                   case t of
                    Tool.Rectangle ->
                      if model.mouseDown
                      then case (g, ml) of
                             ([], Just loc) ->
                                [Grid.makeRectDims (toGrid loc) 0 0]
                             (hd::tl, Just loc) ->
                                case (Grid.rectOrigin hd) of
                                  Just o ->
                                     (Grid.rach_makeRectPts o (toGrid loc))::tl
                                  Nothing ->
                                     (Grid.makeRectDims (toGrid loc) 0 0)::g
                             _ -> g
                      else g
                    _ -> g }, Cmd.none )

  -- SwitchState handles switching between edit mode and save image mode
  SwitchState ->
    if model.editState then
      ( { model | editState = False }, sendEditState False )
    else
      ( { model | editState = True }, sendEditState True )

  -- MouseUpDown handles finishing shapes
  MouseUpDown b ->
    let
      autofill = 
        ( { model | mouseDown = b
                  -- take the unfinished shape from beginning of walls
                  -- and completes it and adds it to ground and remove
                  -- it from walls; also add empty shape to walls
                  , ground = case model.walls of
                              [] -> model.ground
                              hd::tl -> (Grid.pathToShape hd) :: model.ground
                  , walls = case model.walls of
                              [] -> model.walls
                              hd::tl -> (Grid.Path []) :: tl }, Cmd.none )
     in
       -- only complete unfinished shape if mouseup, add an empty shape to
       -- ground for rectangle tool and walls for pen tools
       case (model.tool,b) of
         (Tool.LockedAutofill, False) -> autofill
         (Tool.FreeformAutofill, False) -> autofill
         (Tool.Rectangle, False) ->
              ( { model | mouseDown = b
                        , ground = (Grid.Polygon []) :: model.ground }, Cmd.none )
         (_, False) -> ( { model | mouseDown = b
                                 , walls = (Grid.Path []) :: model.walls }, Cmd.none )
         _ -> ( { model | mouseDown = b }, Cmd.none )
  
  -- SwitchTool handles switching between tools
  SwitchTool t -> ( { model | tool = t }, Cmd.none )

  ClearBoard -> ( { model | ground = [], walls = [] }, Cmd.none )


  RequestMapNames ->
    (model, requestMapNames ())

  RequestMap name ->
    (model, requestMap name)

  MapNames names ->
    (model, Cmd.none)

  LoadMap map ->
    (model, Cmd.none)

  UploadMap map ->
    (model, uploadMap map)




-- View --------------------------------------------------------------

canvas_attributes : Model -> List (Html.Attribute msg)
canvas_attributes m = [ Attr.style "padding-left" "0" 
                      , Attr.style "padding-right" "0"
                      , Attr.style "margin-left" "auto"
                      , Attr.style "margin-right" "auto"
                      , Attr.width  (round (scaleGridToCol_i (m.mapWidth  + 2)))
                      , Attr.height (round (scaleGridToCol_i (m.mapHeight + 2)))
                      , Attr.style "border" "1px solid red"
                      , Attr.id "myCanvas" ]

button_attributes = [ Attr.style "margin" "0 auto"
                    , Attr.style "display" "block"
                    , Attr.style "margin-top" "15px" ]


view : Model -> Html Msg
view model =
  let
    msg = "DND Map Designer Studio Suite Lite"
    save_msg = "Right click and select \"Save Image As...\" to save"
    map = [draw_mouse, draw_paths, draw_ground, draw_grid, draw_bg]
            |> List.map (\f -> f model)
            |> C.group
            |> R.svg
    clear = Html.button [ onClick ClearBoard, Attr.style "margin-left" "5px" ] [ Html.text "Clear" ]
    tools = Html.select [ Attr.style "margin-right" "5px" ] Tool.toolOptions
  in
    Html.div []
        [ Html.h3 [ Attr.align "center"
                  , Attr.style "margin" "15px"
                  , Attr.style "font" "25px Optima, sans-serif"
                  , Attr.style "color" "#F7F9F9" ]
                  [ Html.text msg, Html.sup [ ] [ Html.text "TM"] ]
        , Html.div [ onInput (\s -> case Tool.toTool s of
                                      Just t -> SwitchTool t
                                      Nothing -> SwitchTool Tool.FreeformPen)
                   , Attr.align "center"
                   , Attr.style "margin-bottom" "15px" ]
                   (if model.editState then [ tools, clear ] else [])
        , Html.div [ Attr.align "center"
                   , Attr.id "map_canvas_container"
                   , Attr.style "display" (if model.editState then "block" else "none") ]
                   [ map ]
        , Html.canvas
            ( [Attr.style "display" (if model.editState then "none" else "block")]
                ++ (canvas_attributes model) ) [ ]
        , Html.button ( (onClick SwitchState) :: button_attributes )
                      [ Html.text (if model.editState then "Save" else "Edit") ]
        , Html.div [ Attr.align "center"
                   , Attr.style "margin-top" "15px"
                   , Attr.style "color" "#F7F9F9"
                   , Attr.style "font-family" "Optima, sans-serif" ]
                   (if model.editState then [] else [ Html.text save_msg ]) ]


-- Drawing Map Objects -----------------------------------------------

draw_bg : Model -> C.Collage Msg
draw_bg model =
  let
    width  = scaleGridToCol_i (model.mapWidth  + 2)
    height = scaleGridToCol_i (model.mapHeight + 2)
    green = Color.rgba 0.16 0.49 0.02 0.5 
  in
  C.rectangle width height
    |> C.filled (C.uniform Color.lightGrey)
    |> C.shift (((width / 2) - (scaleGridToCol 1)), ((height / 2) - (scaleGridToCol 1)))

draw_grid : Model -> C.Collage Msg
draw_grid model =
  let
    scale = scaleGridToCol_i

    grid_style = C.traced (C.solid C.thin (C.uniform Color.gray))

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
draw_paths model =
  let
      line_style = C.solid C.thick (C.uniform Color.black)
      col = Color.rgb255 135 130 124
      testlineStyle = (\t -> C.broken [ (5*t,t), (9*t,t), (4*t,t),(6*t,t) ] ((toFloat t)*2.2) (C.uniform col))
      style = C.solid C.verythick (C.uniform Color.darkBrown)
  in
      List.map (path_to_collage line_style) model.walls |> C.group

draw_mouse : Model -> C.Collage Msg
draw_mouse model =
  case model.mouseLocation of
    Nothing -> C.filled C.transparent (C.circle 0)
    Just loc ->
      C.circle 10
        |> C.filled (C.uniform (Color.rgba 255 0 0 0.6))
        |> C.shift (jsToCol model loc)


draw_menu : Model -> C.Collage Msg
draw_menu model =
  let
      width  = scaleGridToCol_i (model.mapWidth - 2)
      
      -- fill and line styles
      outline = C.solid C.ultrathin (C.uniform Color.gray)
      inline = C.solid C.thin (C.uniform Color.black)
      grayfill = C.styled (C.uniform (Color.lightGray), inline)
      blackfill = C.filled (C.uniform (Color.black))
      bgfill = C.styled (C.uniform (Color.lightGray), outline)
      
      -- menu "buttons"; these are really ugly and need to be updated
      -- but they were convenient to make and they'll do for now
      lock_auto = C.square 14 |> grayfill |> C.shiftX 25
                     |> E.onClick (SwitchTool Tool.LockedAutofill)
      free_auto = C.roundedSquare 15 4 |> grayfill |> C.shiftX 50
                     |> E.onClick (SwitchTool Tool.FreeformAutofill)
      lock_pen  = C.square 14 |> blackfill |> C.shiftX 75
                     |> E.onClick (SwitchTool Tool.LockedPen)
      free_pen  = C.circle 7 |> blackfill |> C.shiftX 100
                     |> E.onClick (SwitchTool Tool.FreeformPen)
      rect_tool = C.rectangle 20 14 |> grayfill |> C.shiftX 130
                     |> E.onClick (SwitchTool Tool.Rectangle)
      
      -- menu shape
      menu_bg = C.rectangle width 50 |> bgfill
  in
      List.foldr (\x -> L.at L.left x) menu_bg
                 [lock_auto,free_auto,lock_pen,free_pen,rect_tool]


-- Converting Between Coordinate Systems -----------------------------

{-

Dealing with three coordinate systems:

  Coordinate  "Js"    - HTML/JS position relative to the SVG/canvas element
  C.Point     "Col"   - Elm position within the Collage
  Grid.Point  "Grid"  - Elm position relative to the map grid

  These functions will probably have to get more complicated to account for
  zooming/panning (assuming we implement that) but they're good enough for now

-}

scaling_factor = 35


-- Grid positions to Collage positions

scaleGridToCol : Float -> Float
scaleGridToCol = (*) scaling_factor

scaleGridToCol_i : Int -> Float
scaleGridToCol_i = scaleGridToCol << toFloat

gridToCol : Grid.Point -> C.Point
gridToCol = Grid.mapSame scaleGridToCol


-- Collage positions to Grid positions

scaleColToGrid : Float -> Float
scaleColToGrid n = n / scaling_factor

colToGrid : C.Point -> Grid.Point
colToGrid = Tuple.mapBoth scaleColToGrid scaleColToGrid


-- Screen coordinates to Collage and Grid positions

jsToCol : Model -> Coordinate -> C.Point
jsToCol model coord =
  let
    xpos = (toFloat coord.x) - (scaleGridToCol 1)
    ypos = (scaleGridToCol_i <| model.mapHeight + 2) - ((toFloat coord.y) + (scaleGridToCol 1))

    leftBound =   (scaleGridToCol -1) + 10
    rightBound =  (scaleGridToCol_i <| model.mapWidth  + 1) - 10
    bottomBound = (scaleGridToCol -1) + 10
    topBound =    (scaleGridToCol_i <| model.mapHeight + 1) - 10
  in
    ( clamp leftBound rightBound xpos, clamp bottomBound topBound ypos )


jsToGrid : Model -> Coordinate -> Grid.Point
jsToGrid model coord = colToGrid <| jsToCol model coord


jsToGridLocked : Model -> Coordinate -> Grid.Point
jsToGridLocked model coord =
  Grid.roundPoint <| colToGrid <| jsToCol model coord


-- Converting Shapes to Collage Elements -----------------------------

shape_to_collage : (C.FillStyle, C.LineStyle) -> Grid.Shape -> C.Collage Msg
shape_to_collage (fill, line) shape =
  let
    scale_and_convert = List.map gridToCol >> C.polygon
    style_both =    C.styled (fill, line)
    style_outline = C.styled (C.transparent, line)
    style_fill =    C.filled fill
  in
    case shape of
      -- Convert polygons pretty directly
      Grid.Polygon ps -> scale_and_convert ps |> style_both

      -- Draw the outlines, and only fill in the part that isn't in a hole
      -- This is the tricky part...
      Grid.Composite outline holes ->
        let
          outlines = List.map (style_outline << scale_and_convert) (outline :: holes)
          inside   = style_fill << scale_and_convert <| Grid.flatten shape
        in
          C.group (outlines ++ [inside])

path_to_collage : (C.LineStyle) -> Grid.Path -> C.Collage Msg
path_to_collage line (Grid.Path p) =
  (C.path (List.map gridToCol p)) |> C.traced line




-- Adding and Removing Shapes ----------------------------------------


add_ground_model : Grid.Shape -> Model -> Model
add_ground_model shape model =
  {model | ground = add_ground shape model.ground}

add_ground : Grid.Shape -> List Grid.Shape -> List Grid.Shape
add_ground new_shape shape_list =
  case shape_list of
    [] -> [new_shape]
    head::tail ->
      case Grid.union head new_shape of
        Nothing -> head :: add_ground new_shape tail
        Just u  -> add_ground u tail

add_wall : Grid.Path -> Model -> Model
add_wall path model =
  { model | walls = path :: model.walls }


remove_ground_model : Grid.Shape -> Model -> Model
remove_ground_model shape model =
  {model | ground = remove_ground shape model.ground}

remove_ground : Grid.Shape -> List Grid.Shape -> List Grid.Shape
remove_ground shape shape_list =
  case shape_list of
    [] -> []
    head::tail ->
      case Grid.difference head shape of
        Nothing -> head :: remove_ground shape shape_list
        Just d  -> d ++ (remove_ground shape shape_list )

remove_wall : Grid.Path -> Model -> Model
remove_wall path model = model




-- Interacting with the Database -------------------------------------

-- Convert the current map into an object that can be saved to the database
-- Stores the following fields:
--    - Ground
--    - Walls
encode_model : Model -> Encode.Value
encode_model model =
  let
    -- The different features of the map, encoded
    ground = Encode.list Grid.Json.encodeShape model.ground
    walls  = Encode.list Grid.Json.encodePath  model.walls

    -- The features of the map packaged together
    map = Encode.object [ ("ground", ground), ("walls",  walls)]

  in
    -- The two top-level fields are the name to save it under and the map data
    Encode.object [ ("name", Encode.string "test_map"), ("map", map) ]

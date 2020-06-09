port module Main exposing (..)

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

import SingleSlider

import Grid
import Tool
import Stack

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
  , ground : List MapShape
  , walls  : List MapPath
  , currentDrawing : MapPath
  , currentRect : MapShape
  , editState : Bool
  , mouseDown : Bool
  , tool : Tool.Tool
  , undoStack : Stack.Stack (List MapShape, List MapPath)
  , redoStack : Stack.Stack (List MapShape, List MapPath)
  , erasing : Bool
  , widthSlider : SingleSlider.SingleSlider Msg
  , heightSlider : SingleSlider.SingleSlider Msg
  , currentColor : Color
  }

type alias Coordinate = { x:Int, y:Int }

type Msg
  = NullMsg
  | MouseMove (Maybe Coordinate)
  | SwitchState
  | MouseUpDown Bool
  | SwitchTool Tool.Tool
  | ClearBoard
  | Undo
  | Redo
  | ToggleErasing
  | Download
  | WidthSliderChange Float
  | HeightSliderChange Float
  | SwitchColor Tool.PenColor

type alias Flags = ()

type alias MapShape = { shape : Grid.Shape, color : Color }
type alias MapPath = { path : Grid.Path, color : Color }

newMS : Grid.Shape -> Color -> MapShape
newMS s c =
  { shape = s, color = c }

newMP : Grid.Path -> Color -> MapPath
newMP p c =
  { path = p, color = c }


-- Ports -------------------------------------------------------------

port receiveMouseMove : ((Maybe Coordinate) -> msg) -> Sub msg

port receiveMouseUpDown : (Bool -> msg) -> Sub msg

port sendEditState : Bool -> Cmd msg

port sendDownload : Bool -> Cmd msg




-- Initialization ----------------------------------------------------

init : Flags -> (Model, Cmd Msg)
init () = (initModel, Cmd.none)

initModel : Model
initModel = 
  { mouseLocation = Nothing
  , mapHeight = 15
  , mapWidth = 20
  , ground = []
  , walls = []
  , currentDrawing = newMP (Grid.Path []) Color.black
  , currentRect = newMS (Grid.Polygon []) Color.black
  , editState = True
  , mouseDown = False
  , tool = Tool.FreeformPen
  , undoStack = Stack.empty 5
  , redoStack = Stack.empty 5
  , erasing = False
  , widthSlider = new_w_slider 1 20
  , heightSlider = new_h_slider 1 15
  , currentColor = Color.black
  }



-- Subscriptions and Updates -----------------------------------------

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch
    [ receiveMouseMove MouseMove
    , receiveMouseUpDown MouseUpDown]


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
      cur = model.currentDrawing
      cur_r = model.currentRect
    in
      ( { model | mouseLocation = coord
                , currentDrawing =
                    case model.tool of
                      Tool.Line ->
                        if model.mouseDown
                        then case (Grid.lineOrigin cur.path, ml) of
                          (Just o, Just loc) -> newMP (Grid.makeLinePts o (toGrid loc)) model.currentColor
                          (Nothing, Just loc) -> newMP (Grid.makeLinePts (toGrid loc) (toGrid loc)) model.currentColor
                          _ -> cur
                        else cur
                      Tool.Rectangle -> cur
                      _ -> if model.mouseDown
                           then case ml of
                             Just loc -> newMP (Grid.addPointPath (toGrid loc) cur.path) model.currentColor
                             Nothing -> cur
                           else cur
                , currentRect =
                    case model.tool of
                      Tool.Rectangle ->
                        if model.mouseDown
                        then case (Grid.rectOrigin cur_r.shape, ml) of
                          (Just o, Just loc) -> newMS (Grid.rach_makeRectPts o (toGrid loc)) model.currentColor
                          (Nothing, Just loc) -> newMS (Grid.makeRectDims (toGrid loc) 0 0) model.currentColor
                          _ -> cur_r
                        else cur_r
                      _ -> cur_r }, Cmd.none )

  -- SwitchState handles switching between edit mode and save image mode
  SwitchState ->
    if model.editState then
      ( { model | editState = False }, sendEditState False )
    else
      ( { model | editState = True }, sendEditState True )

  Download ->
    ( model, sendDownload True )

  -- MouseUpDown handles finishing shapes
  MouseUpDown b ->
    let
      autofill =
         { model | mouseDown = b
                 , ground =
                    case model.erasing of
                      False ->
                        add_ground
                          (newMS (Grid.pathToShape model.currentDrawing.path) model.currentDrawing.color)
                          model.ground
                      True ->
                        remove_ground
                          (newMS (Grid.pathToShape model.currentDrawing.path) model.currentDrawing.color)
                          model.ground
                 , currentDrawing = newMP (Grid.Path []) model.currentColor
                 , undoStack = Stack.push (model.ground, model.walls) model.undoStack
                  }
      non_autofill =
        { model | mouseDown = b
                , walls = 
                    case model.erasing of
                      False -> add_wall model.currentDrawing model.walls
                      True -> remove_wall model.currentDrawing model.walls
                , currentDrawing = newMP (Grid.Path []) model.currentColor
                , undoStack = Stack.push (model.ground, model.walls) model.undoStack }
      rect =
        { model | mouseDown = b
                , ground =
                    case model.erasing of
                      False -> add_ground model.currentRect model.ground
                      True -> remove_ground model.currentRect model.ground
                , currentRect = newMS (Grid.Polygon []) model.currentColor
                , undoStack = Stack.push (model.ground, model.walls) model.undoStack }
    in
       case (model.tool,b) of
         (Tool.LockedAutofill, False) ->
           ( { autofill | heightSlider =
                           new_h_slider (max_y_ground autofill.ground)
                                        (SingleSlider.fetchValue autofill.heightSlider)
                        , widthSlider =
                           new_w_slider (max_x_ground autofill.ground)
                                        (SingleSlider.fetchValue autofill.widthSlider) }, Cmd.none )
         (Tool.FreeformAutofill, False) ->
           ( { autofill | heightSlider =
                            new_h_slider (max_y_ground autofill.ground)
                                         (SingleSlider.fetchValue autofill.heightSlider)
                        , widthSlider =
                            new_w_slider (max_x_ground autofill.ground)
                                         (SingleSlider.fetchValue autofill.widthSlider) }, Cmd.none )
         (Tool.Rectangle, False) ->
           ( { rect | heightSlider =
                       new_h_slider (max_y_ground rect.ground)
                                    (SingleSlider.fetchValue rect.heightSlider)
                    , widthSlider =
                       new_w_slider (max_x_ground rect.ground)
                                    (SingleSlider.fetchValue rect.widthSlider) }, Cmd.none )
         (_, False) ->
           ( { non_autofill | heightSlider =
                               new_h_slider (max_y_walls non_autofill.walls)
                                            (SingleSlider.fetchValue non_autofill.heightSlider)
                            , widthSlider =
                               new_w_slider (max_x_walls non_autofill.walls)
                                            (SingleSlider.fetchValue non_autofill.widthSlider) }, Cmd.none )
         _ -> ( { model | mouseDown = b
                        , editState = True }, Cmd.none )
  
  -- SwitchTool handles switching between tools
  SwitchTool t -> ( { model | editState = True
                            , tool = t }, Cmd.none )

  SwitchColor c -> ( { model | editState = True
                             , currentColor = (Tool.convertColor c) }, Cmd.none )

  ClearBoard -> ( { model | editState = True
                          , ground = []
                          , walls = []
                          , undoStack = Stack.empty 5
                          , redoStack = Stack.empty 5
                          , heightSlider = new_h_slider 1 (SingleSlider.fetchValue model.heightSlider)
                          , widthSlider = new_w_slider 1 (SingleSlider.fetchValue model.widthSlider) }, Cmd.none )

  Undo ->
    case Stack.pop model.undoStack of
      Just ((prev_g, prev_w), rest) ->
        ( { model | editState = True
                  , redoStack = Stack.push (model.ground, model.walls) model.redoStack
                  , ground = prev_g
                  , walls = prev_w
                  , undoStack = rest
                  , heightSlider =
                       new_h_slider (max (max_y_ground prev_g) (max_y_walls prev_w))
                                    (SingleSlider.fetchValue model.heightSlider)
                  , widthSlider =
                       new_w_slider (max (max_x_ground prev_g) (max_x_walls prev_w))
                                    (SingleSlider.fetchValue model.widthSlider) }, Cmd.none )
      Nothing -> ( model, Cmd.none )

  Redo ->
    case Stack.pop model.redoStack of
      Just ((redo_g, redo_w), rest) ->
        ( { model | editState = True
                  , undoStack = Stack.push (model.ground, model.walls) model.undoStack
                  , ground = redo_g
                  , walls = redo_w 
                  , redoStack = rest
                  , heightSlider =
                      new_h_slider (max (max_y_ground redo_g) (max_y_walls redo_w))
                                   (SingleSlider.fetchValue model.heightSlider)
                  , widthSlider =
                      new_w_slider (max (max_x_ground redo_g) (max_x_walls redo_w))
                                   (SingleSlider.fetchValue model.widthSlider) }, Cmd.none )
      Nothing -> ( model, Cmd.none )
  
  ToggleErasing ->
    ( { model | erasing = case model.erasing of
                            True -> False
                            False -> True }, Cmd.none )

  WidthSliderChange str ->
    let
        newSlider = SingleSlider.update str model.widthSlider
    in
        ( { model | editState = True
                  , widthSlider = newSlider
                  , mapWidth = round (SingleSlider.fetchValue model.widthSlider) }, Cmd.none )

  HeightSliderChange str ->
    let
        newSlider = SingleSlider.update str model.heightSlider
    in
        ( { model | editState = True
                  , heightSlider = newSlider
                  , mapHeight = round (SingleSlider.fetchValue model.heightSlider) }, Cmd.none )




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

blah : Bool -> String
blah b =
  case b of
    True -> "True"
    False -> "False"

view : Model -> Html Msg
view model =
  let
    msg = "D\u{0026}D Map Designer Studio Suite Lite"
    map = [draw_mouse, draw_paths, draw_ground, draw_grid, draw_bg]
            |> List.map (\f -> f model)
            |> C.group
            |> R.svg
    clear = Html.button [ onClick ClearBoard, Attr.style "margin-left" "8px" ] [ Html.text "Clear" ]
    tools = Html.select [ Attr.style "margin" "2px" ] Tool.toolOptions
    undo = Html.button [ onClick Undo, Attr.style "margin-right" "5px" ] [ Html.text "Undo" ]
    redo = Html.button [ onClick Redo, Attr.style "margin-right" "8px" ] [ Html.text "Redo" ]
    eraser = Html.button [ onClick ToggleErasing, Attr.style "margin-left" "5px" ] [Html.text (blah model.erasing) ]
    pencolors = Html.select [] Tool.penColorOptions
  in
    Html.div []
        [ Html.h3 [ Attr.align "center"
                  , Attr.style "margin" "15px"
                  , Attr.style "font" "25px Optima, sans-serif"
                  , Attr.style "color" "#F7F9F9" ]
                  [ Html.text msg, Html.sup [ ] [ Html.text "\u{2122}"] ]
        , Html.div [ Attr.align "center"
                   , Attr.style "margin-bottom" "10px" ]
                   [ SingleSlider.view model.widthSlider, SingleSlider.view model.heightSlider ]
        , Html.div [ onInput (\s -> case Tool.toTool s of
                                      Just t -> SwitchTool t
                                      Nothing -> SwitchTool Tool.FreeformPen)
                   , Attr.align "center"
                   , Attr.style "margin-bottom" "15px" ]
                   [ undo, redo, tools, clear ]
        , Html.div [ onInput (\s -> case Tool.toPenColor s of
                                      Just c -> SwitchColor c
                                      Nothing -> SwitchColor Tool.Red)
                   , Attr.align "center" ]
                   [ pencolors ]
        , Html.div [ Attr.align "center"
                   , Attr.id "map_canvas_container"
                   , Attr.style "display" (if model.editState then "block" else "block") ]
                   [ map ]
        , Html.canvas
            ( [Attr.style "display" (if model.editState then "none" else "none")]
                ++ (canvas_attributes model) ) [ ]
        , (if model.editState
          then Html.button ( (onClick SwitchState) :: button_attributes )
                           [ Html.text "Save as Image" ]
          else Html.button ( (onClick Download) :: button_attributes )
                           [ Html.text "Download" ])
        ]


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
    shape_to_collage fill_style model.currentRect
      :: List.map (shape_to_collage fill_style) model.ground 
           |> C.group

draw_paths : Model -> C.Collage Msg
draw_paths model =
  let
      line_style = C.solid C.thick (C.uniform Color.black)
      col = Color.rgb255 135 130 124
      testlineStyle = (\t -> C.broken [ (5*t,t), (9*t,t), (4*t,t),(6*t,t) ] ((toFloat t)*2.2) (C.uniform col))
      style = C.solid C.verythick (C.uniform Color.darkBrown)
      ugh = { line_style | thickness = 80 }
      dotstyle = C.broken [ (5, 2), (15, 2) ] 5 (C.uniform Color.darkBrown)
      hedge = C.dot 5 (C.uniform Color.darkGreen)
  in
      path_to_collage model.currentDrawing
        :: (List.map path_to_collage model.walls) 
            |> C.group

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

shape_to_collage : C.FillStyle -> MapShape -> C.Collage Msg
shape_to_collage fill ms =
  let
    shape = ms.shape
    col = ms.color
    line = C.solid C.thick (C.uniform col)
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

path_to_collage : MapPath -> C.Collage Msg
path_to_collage mp =
  let
      path = mp.path
      col = mp.color
      line = C.solid C.thick (C.uniform col)
  in
      case path of
        Grid.Path p -> (C.path (List.map gridToCol p)) |> C.traced line




-- Adding and Removing Shapes ----------------------------------------


add_ground_model : MapShape -> Model -> Model
add_ground_model shape model =
  {model | ground = add_ground shape model.ground}

add_ground : MapShape -> List MapShape -> List MapShape
add_ground new_shape shape_list =
  case shape_list of
    [] -> [new_shape]
    head::tail ->
      case Grid.union head.shape new_shape.shape of
        Nothing -> head :: add_ground new_shape tail
        Just u  -> add_ground (newMS u head.color) tail

add_wall : MapPath -> List MapPath -> List MapPath
add_wall path path_list =
  path :: path_list


remove_ground_model : MapShape -> Model -> Model
remove_ground_model shape model =
  {model | ground = remove_ground shape model.ground}

remove_ground : MapShape -> List MapShape -> List MapShape
remove_ground shape shape_list =
  case shape_list of
    [] -> []
    head::tail ->
      case Grid.difference head.shape shape.shape of
        Nothing -> head :: remove_ground shape tail
        Just d  -> (List.map (\x -> newMS x head.color) d) ++ (remove_ground shape tail)

remove_wall : MapPath -> List MapPath -> List MapPath
remove_wall path path_list = path_list



-- Manipulating Shapes -----------------------------------------------

msToShapeList : List MapShape -> List Grid.Shape
msToShapeList mss =
  List.map (\x -> x.shape) mss

mpToPathList : List MapPath -> List Grid.Path
mpToPathList mps =
  List.map (\x -> x.path) mps

max_y_shape : Grid.Shape -> Float
max_y_shape s =
  case s of
    Grid.Polygon p ->
      case Tuple.second (List.unzip p) |> List.maximum of
        Nothing -> 1
        Just y -> y
    Grid.Composite outside holes -> max_y_shape (Grid.Polygon outside)

max_y_ground : List MapShape -> Float
max_y_ground xs =
  case List.map max_y_shape (msToShapeList xs) |> List.maximum of
    Nothing -> 1
    Just y -> y

max_x_shape : Grid.Shape -> Float
max_x_shape s =
  case s of
    Grid.Polygon p ->
      case Tuple.first (List.unzip p) |> List.maximum of
        Nothing -> 1
        Just x -> x
    Grid.Composite outside holes -> max_x_shape (Grid.Polygon outside)

max_x_ground : List MapShape -> Float
max_x_ground xs =
  case List.map max_x_shape (msToShapeList xs) |> List.maximum of
    Nothing -> 1
    Just x -> x

max_y_path : Grid.Path -> Float
max_y_path (Grid.Path p) =
  case Tuple.second (List.unzip p) |> List.maximum of
    Nothing -> 1
    Just y -> y

max_y_walls : List MapPath -> Float
max_y_walls xs =
  case List.map max_y_path (mpToPathList xs) |> List.maximum of
    Nothing -> 1
    Just y -> y

max_x_path : Grid.Path -> Float
max_x_path (Grid.Path p) =
  case Tuple.first (List.unzip p) |> List.maximum of
    Nothing -> 1
    Just x -> x

max_x_walls : List MapPath -> Float
max_x_walls xs =
  case List.map max_x_path (mpToPathList xs) |> List.maximum of
    Nothing -> 1
    Just x -> x

-- Extra Helper Functions -------------------------------------------

new_h_slider : Float -> Float -> SingleSlider.SingleSlider Msg
new_h_slider min val =
  SingleSlider.init
    { min = min, max = 50, value = val, step = 1, onChange = HeightSliderChange }
      |> SingleSlider.withMinFormatter (\value -> "")
      |> SingleSlider.withMaxFormatter (\value -> "")
      |> SingleSlider.withValueFormatter (\x y -> "")

new_w_slider : Float -> Float -> SingleSlider.SingleSlider Msg
new_w_slider min val =
 SingleSlider.init
    { min = min, max = 50, value = val, step = 1, onChange = WidthSliderChange }
      |> SingleSlider.withMinFormatter (\value -> "")
      |> SingleSlider.withMaxFormatter (\value -> "")
      |> SingleSlider.withValueFormatter (\x y -> "")
 

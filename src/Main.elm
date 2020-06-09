port module Main exposing (..)

-- Add/modify imports if you'd like. ---------------------------------

import Browser
import Html.Styled as Html exposing (Html)
import Html.Styled.Attributes as Attr
import Html.Styled.Events exposing (..)

import Css
import Css.Global
import Svg.Styled

import String exposing (fromInt, fromFloat, repeat)
import Debug

import Collage as C
import Collage.Layout as L
import Collage.Events as E
import Collage.Render as R
import Color exposing (Color)

import SingleSlider

import Grid
import Grid.Json
import Tool
import Stack

import Json.Encode as Encode
import Json.Decode as Decode

-- Main Stuff --------------------------------------------------------

main : Program Flags Model Msg
main = 
  Browser.element
    { init = init
    , view = view >> Html.toUnstyled
    , update = update
    , subscriptions = subscriptions
    }

type alias Model = 
  { mouseLocation : Maybe Coordinate
  , mapHeight : Int
  , mapWidth : Int
  , ground : List Grid.Shape
  , walls  : List Grid.Path
  , currentDrawing : Grid.Path
  , currentRect : Grid.Shape
  , editState : Bool
  , mouseDown : Bool
  , tool : Tool.Tool
  , galleryMaps : List Map
  , undoStack : Stack.Stack (List Grid.Shape, List Grid.Path)
  , redoStack : Stack.Stack (List Grid.Shape, List Grid.Path)
  , erasing : Bool
  , widthSlider : SingleSlider.SingleSlider Msg
  , heightSlider : SingleSlider.SingleSlider Msg
  }

type alias Coordinate = { x:Int, y:Int }

type alias Map =
  { name   : String
  , ground : List Grid.Shape
  , walls  : List Grid.Path
  }

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
  | LoadMap (Maybe Map)
  | RequestGallery
  | LoadGallery (List Map)
  | UploadMap Encode.Value
  | LoadGalleryMap Map
  | Undo
  | Redo
  | ToggleErasing
  | Download
  | WidthSliderChange Float
  | HeightSliderChange Float

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

port requestGallery : () -> Cmd msg
port receiveGallery : (Encode.Value -> msg) -> Sub msg

port sendDownload : Bool -> Cmd msg




-- Initialization ----------------------------------------------------

init : Flags -> (Model, Cmd Msg)
init () = (initModel, requestGallery ())

initModel : Model
initModel = 
  { mouseLocation = Nothing
  , mapHeight = 20
  , mapWidth = 25
  , ground = [ ]
  , walls = [ ]
  , currentDrawing = Grid.Path [ ]
  , currentRect = Grid.Polygon []
  , editState = True
  , mouseDown = False
  , tool = Tool.FreeformPen
  , galleryMaps = []
  , undoStack = Stack.empty 5
  , redoStack = Stack.empty 5
  , erasing = False
  , widthSlider = new_w_slider 1 20
  , heightSlider = new_h_slider 1 15
  }



-- Subscriptions and Updates -----------------------------------------

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch
    [ receiveMouseMove MouseMove
    , receiveMouseUpDown MouseUpDown
    , receiveMapNames MapNames
    , receiveMap (LoadMap << decode_map)
    , receiveGallery (LoadGallery << decode_gallery)
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
      cur = model.currentDrawing
      cur_r = model.currentRect
    in
      ( { model | mouseLocation = coord
                , currentDrawing =
                    case model.tool of
                      Tool.Line ->
                        if model.mouseDown
                        then case (Grid.lineOrigin cur, ml) of
                          (Just o, Just loc) -> Grid.makeLinePts o (toGrid loc)
                          (Nothing, Just loc) -> Grid.makeLinePts (toGrid loc) (toGrid loc)
                          _ -> cur
                        else cur
                      Tool.Rectangle -> cur
                      _ -> if model.mouseDown
                           then case ml of
                             Just loc -> Grid.addPointIfBeyond 0.1 (toGrid loc) cur
                             Nothing -> cur
                           else cur
                , currentRect =
                    case model.tool of
                      Tool.Rectangle ->
                        if model.mouseDown
                        then case (Grid.rectOrigin cur_r, ml) of
                          (Just o, Just loc) -> Grid.rach_makeRectPts o (toGrid loc)
                          (Nothing, Just loc) -> Grid.makeRectDims (toGrid loc) 0 0
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
                        add_ground (Grid.pathToShape model.currentDrawing) model.ground
                      True ->
                        remove_ground (Grid.pathToShape model.currentDrawing) model.ground
                 , currentDrawing = Grid.Path []
                 , undoStack = Stack.push (model.ground, model.walls) model.undoStack
                  }
      non_autofill =
        { model | mouseDown = b
                , walls = 
                    case model.erasing of
                      False -> add_wall model.currentDrawing model.walls
                      True -> remove_wall model.currentDrawing model.walls
                , currentDrawing = Grid.Path []
                , undoStack = Stack.push (model.ground, model.walls) model.undoStack }
      rect =
        { model | mouseDown = b
                , ground =
                    case model.erasing of
                      False -> add_ground model.currentRect model.ground
                      True -> remove_ground model.currentRect model.ground
                , currentRect = Grid.Polygon []
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


  RequestMapNames ->
    (model, requestMapNames ())

  RequestMap name ->
    (model, requestMap name)

  RequestGallery ->
    (model, requestGallery ())

  MapNames names ->
    (model, Cmd.none)

  LoadMap map ->
    (model, Cmd.none)

  LoadGallery maps ->
    ( {model | galleryMaps = maps} , Cmd.none)

  UploadMap map ->
    (model, uploadMap map)

  LoadGalleryMap map ->
    ( {model | ground = map.ground, walls = map.walls }, Cmd.none)




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
    msg = "DND Map Designer Studio Suite Lite"
    map = [draw_mouse, draw_paths, draw_ground, draw_grid, draw_bg]
            |> List.map (\f -> f model)
            |> C.group
            |> R.svg
            |> Svg.Styled.fromUnstyled
    clear = Html.button [ onClick ClearBoard, Attr.style "margin-left" "8px" ] [ Html.text "Clear" ]
    tools = Html.select [ Attr.style "margin" "2px" ] Tool.toolOptions
    undo = Html.button [ onClick Undo, Attr.style "margin-right" "5px" ] [ Html.text "Undo" ]
    redo = Html.button [ onClick Redo, Attr.style "margin-right" "8px" ] [ Html.text "Redo" ]
    eraser = Html.button [ onClick ToggleErasing, Attr.style "margin-left" "5px" ] [Html.text (blah model.erasing) ]
    savebar =
      Html.div [ Attr.align "center" ]
               [ Html.button [ onClick RequestMapNames ] [Html.text "Request Map Names"]
               , Html.button [ onClick <| RequestMap "test_map"] [Html.text "Request Map"]
               , Html.button [ onClick <| UploadMap (encode_model model) ] [Html.text "Upload"]
               ]
  in
    --sidebar
    Html.div [ Attr.style "display" "flex" ]
    [
      -- Styling to create the sidebar
      Html.aside
      [ Attr.css [ Css.width <| Css.pct 20 ]
      , Attr.style "background" "#444444"
      , Attr.align "center"
      ]
      -- Gallery of database maps in the sidebar
      [ map_gallery model.galleryMaps ]
    ,
      Html.div
      [ Attr.css
        [ Css.flex <| Css.int 1
        , Css.overflow Css.auto
        ]
      ]
    [
      Html.div []
        [ Html.h3 [ Attr.align "center"
                  , Attr.style "margin" "15px"
                  , Attr.style "font" "25px Optima, sans-serif"
                  , Attr.style "color" "#F7F9F9" ]
                  [ Html.text msg, Html.sup [ ] [ Html.text "TM"] ]
        , Html.div [ Attr.align "center"
                   , Attr.style "margin-bottom" "10px" ]
                   (List.map Html.fromUnstyled [ SingleSlider.view model.widthSlider, SingleSlider.view model.heightSlider ])
        , Html.div [ onInput (\s -> case Tool.toTool s of
                                      Just t -> SwitchTool t
                                      Nothing -> SwitchTool Tool.FreeformPen)
                   , Attr.align "center"
                   , Attr.style "margin-bottom" "15px" ]
                   [ undo, redo, tools, clear ]
        , savebar
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
      ]

      -- Global style tag to show the gallery map label tags on mouseover
      , Css.Global.global
        [ Css.Global.typeSelector ".gallerymapcontainer:hover .gallerymaptag"
          [Css.visibility Css.visible]
        ]
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
    shape_to_collage gridToCol (fill_style, line_style) model.currentRect
      :: List.map (shape_to_collage gridToCol (fill_style, line_style)) model.ground 
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
      path_to_collage gridToCol line_style model.currentDrawing
        :: (List.map (path_to_collage gridToCol line_style) model.walls)
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





make_thumbnail : Float -> Map -> Html Msg
make_thumbnail thumbnail_size map =
  let
    fill_style = C.uniform (Color.rgba 1 1 1 0.5)
    line_style = C.solid C.thick (C.uniform Color.black)

    shift_size = thumbnail_size / 2

    convert_ground = shape_to_collage (Grid.mapSame ((*) 8)) (fill_style, line_style)
    convert_walls  = path_to_collage  (Grid.mapSame ((*) 8)) line_style

    display = List.map convert_walls map.walls ++ List.map convert_ground map.ground
      |> C.group |> C.shift (-shift_size, -shift_size)
      |> R.svgBox (thumbnail_size, thumbnail_size) |> Svg.Styled.fromUnstyled
  in
    Html.div
      [ Attr.class "gallerymapcontainer"
      , Attr.css
        -- Relative positioning necessary for the child tooltip
        [ Css.position Css.relative
        -- Change mouse pointer to indicate selection is allowed
        , Css.cursor Css.pointer
        ]
      -- When thumbnail clicked, load the given map
      , onClick <| LoadGalleryMap map
      ]
      [ Html.div

        -- Make the thumbnail fade a bit on mouseover
        [ Attr.css [ Css.hover [ Css.opacity (Css.num 0.5) ] ] ]

        -- The thumbnail image itself
        [display]

      -- The tooltip nametag
      , Html.span
        [ Attr.class "gallerymaptag"

        -- The CSS styling
        , Attr.css

          -- Positioning: bottom left corner
          [ Css.position Css.absolute
          , Css.bottom  (Css.px 5)
          , Css.left    (Css.px 5)

          -- Rounded corners
          , Css.padding      (Css.px 5)
          , Css.borderRadius (Css.px 6)

          -- Colors: white text on black background, slightly transparent
          , Css.color           (Css.hex "#ffffff")
          , Css.backgroundColor (Css.hex "#000000")
          , Css.opacity         (Css.num 0.8)

          -- Default to hidden, only shown on mouseover
          , Css.visibility Css.hidden
          ]
        ]
        [ Html.text map.name
        ]
      ]



map_gallery : List Map -> Html Msg
map_gallery maps =
  let
    thumbnails = List.map (make_thumbnail 190) maps

    make_flexbox content =
      Html.div
        [ Attr.css
            [ Css.flexBasis <| Css.pct 25
            , Css.padding2 Css.zero (Css.px 8)
            ]
        , Attr.align "center"
        ]
        [ content ]
  in
    Html.div
      [ Attr.align "center" ]
      [ Html.h3 [Attr.style "color" "#F7F9F9"] [Html.text "Gallery"]
      , Html.div
          [ Attr.css
              [ Css.displayFlex
              , Css.flexWrap Css.wrap
              , Css.margin2 Css.zero (Css.px -8)
              , Css.justifyContent Css.center
              , Css.alignItems Css.center
              ]
          ]
          (List.map make_flexbox thumbnails)
        ]




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

shape_to_collage : (Grid.Point -> C.Point) -> (C.FillStyle, C.LineStyle) -> Grid.Shape -> C.Collage Msg
shape_to_collage grid_to_collage (fill, line) shape =
  let
    scale_and_convert = List.map grid_to_collage >> C.polygon
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

path_to_collage : (Grid.Point -> C.Point) ->  C.LineStyle -> Grid.Path -> C.Collage Msg
path_to_collage grid_to_collage line (Grid.Path p) =
  (C.path (List.map grid_to_collage p)) |> C.traced line




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

add_wall : Grid.Path -> List Grid.Path -> List Grid.Path
add_wall path path_list =
  path :: path_list


remove_ground_model : Grid.Shape -> Model -> Model
remove_ground_model shape model =
  {model | ground = remove_ground shape model.ground}

remove_ground : Grid.Shape -> List Grid.Shape -> List Grid.Shape
remove_ground shape shape_list =
  case shape_list of
    [] -> Debug.log "rm ground 1" []
    head::tail ->
      case Grid.difference head shape of
        Nothing -> Debug.log "rm ground 2"  head :: remove_ground shape shape_list
        Just d  -> Debug.log "rm ground 3" d ++ (remove_ground shape shape_list )

remove_wall : Grid.Path -> List Grid.Path -> List Grid.Path
remove_wall path path_list = path_list



-- Manipulating Shapes -----------------------------------------------

max_y_shape : Grid.Shape -> Float
max_y_shape s =
  case s of
    Grid.Polygon p ->
      case Tuple.second (List.unzip p) |> List.maximum of
        Nothing -> 1
        Just y -> y
    Grid.Composite outside holes -> max_y_shape (Grid.Polygon outside)

max_y_ground : List Grid.Shape -> Float
max_y_ground xs =
  case List.map max_y_shape xs |> List.maximum of
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

max_x_ground : List Grid.Shape -> Float
max_x_ground xs =
  case List.map max_x_shape xs |> List.maximum of
    Nothing -> 1
    Just x -> x

max_y_path : Grid.Path -> Float
max_y_path (Grid.Path p) =
  case Tuple.second (List.unzip p) |> List.maximum of
    Nothing -> 1
    Just y -> y

max_y_walls : List Grid.Path -> Float
max_y_walls xs =
  case List.map max_y_path xs |> List.maximum of
    Nothing -> 1
    Just y -> y

max_x_path : Grid.Path -> Float
max_x_path (Grid.Path p) =
  case Tuple.first (List.unzip p) |> List.maximum of
    Nothing -> 1
    Just x -> x

max_x_walls : List Grid.Path -> Float
max_x_walls xs =
  case List.map max_x_path xs |> List.maximum of
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


map_decoder : Decode.Decoder Map
map_decoder =
  let
    decode_or_empty field decoder default =
      Decode.maybe (Decode.field field decoder)
        |> Decode.map (Maybe.withDefault default)

    decode_name   = decode_or_empty "name" Decode.string ""
    decode_ground = decode_or_empty "ground" (Decode.list Grid.Json.shapeDecoder) []
    decode_walls  = decode_or_empty "walls"  (Decode.list Grid.Json.pathDecoder ) []
  in
    Decode.map3 Map decode_name decode_ground decode_walls


decode_map : Encode.Value -> Maybe Map
decode_map =
  Result.toMaybe << Decode.decodeValue map_decoder


-- Does this have to explicitly handle Maybe values in the maps?
gallery_decoder : Decode.Decoder (List Map)
gallery_decoder =
    Decode.list map_decoder

decode_gallery : Encode.Value -> List Map
decode_gallery =
  Result.withDefault [] << Decode.decodeValue gallery_decoder

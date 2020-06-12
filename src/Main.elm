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
import Maybe.Extra as MaybeE

import Collage as C
import Collage.Layout as L
import Collage.Events as E
import Collage.Render as R
import Color exposing (Color)

import SingleSlider
import ColorPicker
import FormElements.Switch as Switch

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
  , ground : List MapShape
  , walls  : List MapPath
  , currentDrawing : MapPath
  , currentRect : MapShape
  , editState : Bool
  , mouseDown : Bool
  , tool : Tool.Tool
  , galleryMaps : List Map
  , mapName : String
  , undoStack : Stack.Stack (List MapShape, List MapPath)
  , redoStack : Stack.Stack (List MapShape, List MapPath)
  , erasing : Bool
  , widthSlider : SingleSlider.SingleSlider Msg
  , heightSlider : SingleSlider.SingleSlider Msg
  , currentColor : Color
  , colorPicker : ColorPicker.State
  }

type alias Coordinate = { x:Int, y:Int }

type alias Map =
  { name   : String
  , ground : List MapShape
  , walls  : List MapPath
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
  | ToggleSwitch Bool
  | Download
  | WidthSliderChange Float
  | HeightSliderChange Float
  | ColorPickerMsg ColorPicker.Msg
  | MapName String

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
  , ground = []
  , walls = []
  , currentDrawing = newMP (Grid.Path []) Color.black
  , currentRect = newMS (Grid.Polygon []) Color.black
  , editState = True
  , mouseDown = False
  , tool = Tool.FreeformPen
  , galleryMaps = []
  , mapName = ""
  , undoStack = Stack.empty 5
  , redoStack = Stack.empty 5
  , erasing = False
  , widthSlider = new_w_slider 1 20
  , heightSlider = new_h_slider 1 15
  , currentColor = Color.black
  , colorPicker = ColorPicker.empty
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
                        then case (Grid.lineOrigin cur.path, ml) of
                          (Just o, Just loc) ->
                            newMP (Grid.makeLinePts o (toGrid loc))
                                  (if model.erasing then Color.lightGray
                                   else model.currentColor)
                          (Nothing, Just loc) ->
                            newMP (Grid.makeLinePts (toGrid loc) (toGrid loc))
                                  (if model.erasing then Color.lightGray
                                   else model.currentColor)
                          _ -> cur
                        else cur
                      Tool.Rectangle -> cur
                      _ -> if model.mouseDown
                           then case ml of
                             Just loc ->
                               newMP (Grid.addPointIfBeyond 0.1 (toGrid loc) cur.path)
                                     (if model.erasing
                                      then (case model.tool of
                                             Tool.LockedAutofill -> model.currentColor
                                             Tool.FreeformAutofill -> model.currentColor
                                             _ -> Color.lightGray)
                                      else model.currentColor)
                             Nothing -> cur
                           else cur
                , currentRect =
                    case model.tool of
                      Tool.Rectangle ->
                        if model.mouseDown
                        then case (Grid.rectOrigin cur_r.shape, ml) of
                          (Just o, Just loc) ->
                            newMS (Grid.rach_makeRectPts o (toGrid loc)) model.currentColor
                          (Nothing, Just loc) ->
                            newMS (Grid.makeRectDims (toGrid loc) 0 0) model.currentColor
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
                          (newMS (Grid.pathToShape model.currentDrawing.path)
                                  model.currentDrawing.color)
                          model.ground
                      True ->
                        remove_ground
                          (newMS (Grid.pathToShape model.currentDrawing.path)
                                  model.currentDrawing.color)
                          model.ground
                 , currentDrawing = newMP (Grid.Path []) model.currentColor
                 , undoStack = Stack.push (model.ground, model.walls) model.undoStack }
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

  ClearBoard -> ( { model | editState = True
                          , ground = []
                          , walls = []
                          , undoStack = Stack.empty 5
                          , redoStack = Stack.empty 5
                          , heightSlider =
                             new_h_slider 1 (SingleSlider.fetchValue model.heightSlider)
                          , widthSlider =
                             new_w_slider 1 (SingleSlider.fetchValue model.widthSlider) }, Cmd.none )

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

  ColorPickerMsg message ->
    let
        ( m, color ) = ColorPicker.update message model.currentColor model.colorPicker
    in
        ( { model | colorPicker = m
                  , currentColor = color |> Maybe.withDefault model.currentColor }, Cmd.none )

  ToggleSwitch isToggled ->
    ( { model | erasing = isToggled }, Cmd.none )

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
    ( {model | ground = map.ground, walls = map.walls, mapName = map.name }, Cmd.none)

  MapName str ->
    ( { model | mapName = str }, Cmd.none)



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
    msg = "D\u{0026}D Map Designer Studio Suite Lite"
    map = [draw_mouse, draw_grid, draw_ground, draw_paths, draw_bg]
            |> List.map (\f -> f model)
            |> C.group
            |> R.svg
            |> Svg.Styled.fromUnstyled
    clear = Html.button [ onClick ClearBoard, Attr.style "margin-left" "8px" ] [ Html.text "Clear" ]
    tools = Html.select [ Attr.style "margin-bottom" "10px"
                        , Attr.style "margin-top" "5px" ] Tool.toolOptions
    undo = Html.button [ onClick Undo, Attr.style "margin-right" "15px" ] [ Html.text "Undo" ]
    redo = Html.button [ onClick Redo, Attr.style "margin-right" "10px" ] [ Html.text "Redo" ]
    eraser = Html.div [ Attr.style "min-width" "130px"]
                      [ Html.fromUnstyled
                          (Switch.view { isOn = model.erasing
                                       , label = "Eraser Mode: " ++ (if model.erasing then "On" else "Off")
                                       , handleToggle = ToggleSwitch }) ]
    colorpicker = Html.div [ Attr.style "margin" "15px"
                           , Attr.style "margin-left" "20px" ]
                           [ ColorPicker.view model.currentColor model.colorPicker
                                  |> Html.fromUnstyled |> Html.map ColorPickerMsg ]
    downloadButton =
      (if model.editState
        then Html.button ( (onClick SwitchState) :: button_attributes )
                         [ Html.text "Save as Image" ]
        else Html.button ( (onClick Download) :: button_attributes )
                         [ Html.text "Download" ])
    savebar =
      Html.div
        [ Attr.align "center"
        , Attr.css [{-Css.position Css.absolute,-} Css.bottom (Css.px 5)]
        ]
        [ Html.input [ Attr.value model.mapName, onInput MapName ] []
        , Html.button ((onClick <| UploadMap (encode_model model)) :: button_attributes) [Html.text "Upload"]
        , downloadButton
        ]
    menu_items =
      Html.div [ onInput (\s -> case Tool.toTool s of
                                  Just t -> SwitchTool t
                                  Nothing -> SwitchTool Tool.FreeformPen)
               , Attr.style "display" "inline-block"
               , Attr.style "vertical-align" "top" ]
               [ tools, eraser, colorpicker, undo, redo, clear ]
  in
    Html.div
    [ Attr.align "center"
    , Attr.style "color" "#FBFBFB"
    ]
    [ Html.h3 [ Attr.align "center"
              , Attr.style "margin" "15px"
              , Attr.style "font" "25px Optima, sans-serif"
              , Attr.style "display" "inline-block"
              ]
              [ Html.text msg, Html.sup [ ] [ Html.text "\u{2122}"] ]

    , Html.span
      [ Attr.style "display" "inline-block"
      , Attr.style "font" "15px Optima, sans-serif"
      , Attr.style "margin" "25px"
      , Attr.style "position" "absolute"
      , Attr.style "right" "0"
      ]
      [ Html.text "By "
      , Html.a [ Attr.style "color" "#FBFBFB", Attr.href "https://github.com/rachelxwang" ] [Html.text "Rachel Wang"]
      , Html.text " and "
      , Html.a [ Attr.style "color" "#FBFBFB", Attr.href "https://github.com/vlagrassa" ] [Html.text "Vince LaGrassa"]
      ]
    ,

    -- Left sidebar: Map gallery
    Html.div [ Attr.style "display" "flex" ]
    [
      -- Styling to create the sidebar
      Html.aside
      [ Attr.css [ Css.width <| Css.pct 20 ]
      , Attr.style "background" "#444444"
      , Attr.align "center"
      ]
      -- Gallery of database maps in the sidebar
      [ map_gallery model.galleryMaps
      , savebar
      ]

    -- Center area: The map
    , Html.div
      [ Attr.css
        [ Css.flex <| Css.int 1
        , Css.height (Css.px 655)
        , Css.width (Css.pct 60)
        , Css.overflow Css.hidden
        ]
      ]
      [
        -- The actual map itself
        Html.div []
        [ Html.div [ Attr.id "map_canvas_container"
                   , Attr.style "display" "block"
                   , Attr.align "center" ]
                   [map]
        , Html.canvas
            ( [Attr.style "display" "none" ]
                ++ (canvas_attributes model) ) [ ]
        ]
      ]

    --  Right sidebar: Map tools
    , Html.aside
      [ Attr.css
        [ Css.width <| Css.pct 20 ]
      , Attr.style "background" "#444444"
      , Attr.align "center"
      , Attr.css
        [ Css.displayFlex
        , Css.flexWrap Css.wrap
        , Css.justifyContent Css.center
        , Css.alignItems Css.center
        ]
      ]
      [
        Html.div [Attr.align "center"] [menu_items]
      , Html.div [ Attr.align "center"
                   , Attr.style "margin-bottom" "10px" ]
                   (List.map Html.fromUnstyled [ SingleSlider.view model.widthSlider
                                               , SingleSlider.view model.heightSlider ])
      ]

      -- Global style tag to show the gallery map label tags on mouseover
    , Css.Global.global
      [ Css.Global.typeSelector ".gallerymapcontainer:hover .gallerymaptag"
        [Css.visibility Css.visible]
      ]
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

    grid_style = C.traced (C.solid C.thin (C.uniform (Color.rgba 0 0 0 0.1)))

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
    fill_style = C.uniform (Color.rgba 1 1 1 0.8)
    line_style = C.solid C.thick (C.uniform Color.black)
  in
    shape_to_collage gridToCol fill_style model.currentRect
      :: List.map (shape_to_collage gridToCol fill_style) model.ground 
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
      path_to_collage gridToCol model.currentDrawing
        :: (List.map (path_to_collage gridToCol) model.walls) 
            |> C.group


draw_mouse : Model -> C.Collage Msg
draw_mouse model =
  case model.mouseLocation of
    Nothing -> C.filled C.transparent (C.circle 0)
    Just loc ->
      C.circle 10
        |> C.filled (C.uniform (Color.rgba 255 0 0 0.6))
        |> C.shift (jsToCol model loc)


make_thumbnail : Float -> Map -> Html Msg
make_thumbnail thumbnail_size map =
  let
    fill_style = C.uniform (Color.rgba 1 1 1 0.5)
    line_style = C.solid C.thick (C.uniform Color.black)

    shift_size = thumbnail_size / 2

    convert_ground = shape_to_collage (Grid.mapSame ((*) 8)) fill_style -- (fill_style, line_style)
    convert_walls  = path_to_collage  (Grid.mapSame ((*) 8)) -- line_style

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
    thumbnails = List.map (make_thumbnail 140) maps

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
          (List.take 6 <| List.map make_flexbox thumbnails)
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

shape_to_collage : (Grid.Point -> C.Point) -> C.FillStyle -> MapShape -> C.Collage Msg
shape_to_collage grid_to_collage fill ms =
  let
    shape = ms.shape
    col = ms.color
    line = C.solid C.thick (C.uniform col)
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

path_to_collage : (Grid.Point -> C.Point) -> MapPath -> C.Collage Msg
path_to_collage grid_to_collage mp =
  let
      path = mp.path
      col = mp.color
      line = if col == Color.lightGray then C.solid 20 (C.uniform col)
             else C.solid C.thick (C.uniform col)
  in
      case path of
        Grid.Path p -> (C.path (List.map grid_to_collage p)) |> C.traced line



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
remove_wall path path_list =
  (newMP path.path Color.lightGray) :: path_list



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

               

-- Slider Functions ---------------------------------------------------

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

decode_field_default : String -> Decode.Decoder a -> a -> Decode.Decoder a
decode_field_default field decoder default =
  Decode.maybe (Decode.field field decoder)
    |> Decode.map (Maybe.withDefault default)

encode_color : Color -> Encode.Value
encode_color c =
  let
    {red, green, blue, alpha} = Color.toRgba c
  in
    Encode.object
      [ ("red",   Encode.float red)
      , ("green", Encode.float green)
      , ("blue",  Encode.float blue)
      , ("alpha", Encode.float alpha)
      ]

color_decoder : Decode.Decoder Color
color_decoder =
  Decode.map4 Color.rgba
    (decode_field_default "red"   Decode.float 0)
    (decode_field_default "green" Decode.float 0)
    (decode_field_default "blue"  Decode.float 0)
    (decode_field_default "alpha" Decode.float 1)


map_shape_decoder : Decode.Decoder MapShape
map_shape_decoder =
  Decode.map2 MapShape
    (Decode.field "shape" Grid.Json.shapeDecoder)
    (decode_field_default "color" color_decoder (Color.black))

map_path_decoder : Decode.Decoder MapPath
map_path_decoder =
  Decode.map2 MapPath
    (Decode.field "path"  Grid.Json.pathDecoder)
    (decode_field_default "color" color_decoder (Color.black))


-- Convert the current map into an object that can be saved to the database
-- Stores the following fields:
--    - Ground
--    - Walls
encode_model : Model -> Encode.Value
encode_model model =
  let
    encode_ground map_obj = Encode.object
      [ ("shape", Grid.Json.encodeShape map_obj.shape)
      , ("color", encode_color map_obj.color )
      ]
    encode_walls map_obj = Encode.object
      [ ("path", Grid.Json.encodePath map_obj.path)
      , ("color", encode_color map_obj.color )
      ]

    -- The different features of the map, encoded
    ground = Encode.list encode_ground model.ground
    walls  = Encode.list encode_walls  model.walls

    -- The features of the map packaged together
    map = Encode.object [ ("ground", ground), ("walls",  walls)]

  in
    -- The two top-level fields are the name to save it under and the map data
    Encode.object [ ("name", Encode.string model.mapName), ("map", map) ]


map_decoder : Decode.Decoder Map
map_decoder =
  let
    ground_decoder = Decode.map MaybeE.values <| Decode.list (Decode.maybe map_shape_decoder)
    walls_decoder  = Decode.map MaybeE.values <| Decode.list (Decode.maybe map_path_decoder)

    name_field_decoder   = decode_field_default "name"   Decode.string  ""
    ground_field_decoder = decode_field_default "ground" ground_decoder []
    walls_field_decoder  = decode_field_default "walls"  walls_decoder  []

  in
    Decode.map3 Map name_field_decoder ground_field_decoder walls_field_decoder


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

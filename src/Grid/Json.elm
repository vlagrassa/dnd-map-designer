module Grid.Json exposing (..)

import Json.Encode as Encode
import Json.Decode as Decode
import Result

import Grid exposing (..)




-- Points

encode_point : Point -> Encode.Value
encode_point (x,y) =
  Encode.object [("x", Encode.float x), ("y", Encode.float y)]

point_decoder : Decode.Decoder Point
point_decoder =
  Decode.map2 (\x y -> (x,y))
    (Decode.field "x" Decode.float)
    (Decode.field "y" Decode.float)

decode_point : Encode.Value -> Maybe Point
decode_point = Result.toMaybe << Decode.decodeValue point_decoder




-- Polygons

encode_polygon : Polygon -> Encode.Value
encode_polygon = Encode.list encode_point

polygon_decoder : Decode.Decoder Polygon
polygon_decoder = Decode.list point_decoder

decode_polygon : Encode.Value -> Maybe Polygon
decode_polygon = Result.toMaybe << Decode.decodeValue polygon_decoder




-- Shapes

encode_shape : Shape -> Encode.Value
encode_shape shape = case shape of
  Polygon poly ->
    --encode_polygon poly
    Encode.object
      [ ("outline", encode_polygon poly)
      ]
  Composite outline holes ->
    Encode.object
      [ ("outline", encode_polygon outline)
      , ("holes", Encode.list encode_polygon holes)
      ]

shape_decoder : Decode.Decoder Shape
shape_decoder =
  let
    decode_outline =
      Decode.field "outline" polygon_decoder

    decode_holes =
      Decode.maybe (Decode.field "holes" (Decode.list polygon_decoder))
        |> Decode.map (Maybe.withDefault [])
  in
    Decode.map2 (\x y -> fromOutlineAndHoles (x,y)) decode_outline decode_holes

decode_shape : Encode.Value -> Maybe Shape
decode_shape = Result.toMaybe << Decode.decodeValue shape_decoder

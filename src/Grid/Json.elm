module Grid.Json exposing (..)

import Json.Encode as Encode
import Json.Decode as Decode
import Result

import Grid exposing (..)




-- Points

encodePoint : Point -> Encode.Value
encodePoint (x,y) =
  Encode.object [("x", Encode.float x), ("y", Encode.float y)]

pointDecoder : Decode.Decoder Point
pointDecoder =
  Decode.map2 (\x y -> (x,y))
    (Decode.field "x" Decode.float)
    (Decode.field "y" Decode.float)

decodePoint : Encode.Value -> Maybe Point
decodePoint = Result.toMaybe << Decode.decodeValue pointDecoder




-- Polygons

encodePolygon : Polygon -> Encode.Value
encodePolygon = Encode.list encodePoint

polygonDecoder : Decode.Decoder Polygon
polygonDecoder = Decode.list pointDecoder

decodePolygon : Encode.Value -> Maybe Polygon
decodePolygon = Result.toMaybe << Decode.decodeValue polygonDecoder




-- Shapes

encodeShape : Shape -> Encode.Value
encodeShape shape = case shape of
  Polygon poly ->
    Encode.object
      [ ("outline", encodePolygon poly)
      ]
  Composite outline holes ->
    Encode.object
      [ ("outline", encodePolygon outline)
      , ("holes", Encode.list encodePolygon holes)
      ]

shapeDecoder : Decode.Decoder Shape
shapeDecoder =
  let
    decode_outline =
      Decode.field "outline" polygonDecoder

    decode_holes =
      Decode.maybe (Decode.field "holes" (Decode.list polygonDecoder))
        |> Decode.map (Maybe.withDefault [])
  in
    Decode.map2 (\x y -> fromOutlineAndHoles (x,y)) decode_outline decode_holes

decodeShape : Encode.Value -> Maybe Shape
decodeShape = Result.toMaybe << Decode.decodeValue shapeDecoder

module Grid exposing (..)


type alias Point = (Float, Float)

type alias Polygon = List Point

type Shape
  = Polygon   Polygon
  | Composite Polygon (List Polygon)

type Path = Path (List Point)



makeRectPts : Point -> Point -> Shape
makeRectPts p1 p2 =
  let
    corner          = minCoords  p1 p2
    (width, height) = dimensions p1 p2
  in
    makeRectDims corner width height

makeRectDims : Point -> Float -> Float -> Shape
makeRectDims (x, y) width height =
  Polygon [(x, y), (x + width, y), (x + width, y + height), (x, y + height)]




map : (Float -> Float) -> Point -> Point
map f = Tuple.mapBoth f f

map2 : (Float -> Float -> Float) -> Point -> Point -> Point
map2 f p1 p2 =
  let
    xpos = f (Tuple.first p1) (Tuple.first p2)
    ypos = f (Tuple.second p1) (Tuple.second p2)
  in
    (xpos, ypos)

mapX : (Float -> Float) -> Point -> Point
mapX f = Tuple.mapFirst f

mapY : (Float -> Float) -> Point -> Point
mapY f = Tuple.mapSecond f


mapPolygon : (Float -> Float) -> Polygon -> Polygon
mapPolygon f = List.map (map f)

mapShape : (Float -> Float) -> Shape -> Shape
mapShape f shape =
  case shape of
    Polygon ps ->
      Polygon (mapPolygon f ps)
    Composite outline holes ->
      Composite (mapPolygon f outline) (List.map (mapPolygon f) holes)

mapPath : (Float -> Float) -> Path -> Path
mapPath f path =
  case path of
    Path ps -> Path <| List.map (map f) ps



minCoords : Point -> Point -> Point
minCoords = map2 min

maxCoords : Point -> Point -> Point
maxCoords = map2 max

dimensions : Point -> Point -> (Float, Float)
dimensions = map2 (\i j -> abs <| i - j)



-- If two shapes overlap, return their union; if not, return Nothing
union : Shape -> Shape -> Maybe Shape
union a b = Nothing


-- If two shapes overlap, return their intersection; if not, return Nothing
intersection : Shape -> Shape -> Maybe Shape
intersection a b = Nothing

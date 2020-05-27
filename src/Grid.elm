module Grid exposing (..)


type alias Point = (Float, Float)

type Shape
  = Polygon (List Point)
  | Rect Point Point
  | Donut Shape (List Shape)

type Path = Path (List Point)



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


mapShape : (Float -> Float) -> Shape -> Shape
mapShape f shape =
  case shape of
    Polygon ps -> Polygon <| List.map (map f) ps
    Rect p1 p2 -> Rect (map f p1) (map f p2)
    Donut outline holes ->
      Donut (mapShape f outline) (List.map (mapShape f) holes)

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

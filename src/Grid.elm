module Grid exposing (..)


type alias Point = (Float, Float)

type alias Polygon = List Point

type Shape
  = Polygon   Polygon
  | Composite Polygon (List Polygon)

type Path = Path (List Point)


addPointToShape : Point -> Shape -> Shape
addPointToShape point s =
  case s of
    Polygon p -> point::p |> Polygon
    Composite outside holes -> s


addPointPath : Point -> Path -> Path
addPointPath point (Path p) =
  Path (point :: p)


pathToShape : Path -> Shape
pathToShape (Path p) =
  Polygon p


roundPoint : Point -> Point
roundPoint (x,y) =
  (toFloat <| round x, toFloat <| round y)

rectOrigin : Shape -> Maybe Point
rectOrigin s =
  case s of
    Polygon p ->
      case (List.head p) of
        Just point ->
          if ((List.length p) == 4) then Just point
          else Nothing
        Nothing -> Nothing
    Composite outside holes -> Nothing

lineOrigin : Path -> Maybe Point
lineOrigin (Path l) =
  case l of
    fst::_::_ -> Just fst
    _ -> Nothing

makeLinePts : Point -> Point -> Path
makeLinePts p1 p2 =
  Path [p1,p2]

rach_makeRectPts : Point -> Point -> Shape
rach_makeRectPts (x1,y1) (x2,y2) =
  let
    case1 = (x1>x2 && y1>y2) || (x1<x2 && y1<y2)
  in
    Polygon [ (x1, y1)
            , (if case1 then (x1, y2)
               else (max x1 x2, max y1 y2))
            , (x2, y2)
            , (if case1 then (x2, y1)
               else (min x1 x2, min y1 y2)) ]

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

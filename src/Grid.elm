module Grid exposing (..)

import List.Extra as ListE
import Maybe.Extra as MaybeE


type alias Point = (Float, Float)

type alias Line = (Point, Point)
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



map : (Float -> Float, Float -> Float) -> Point -> Point
map (f, g) = Tuple.mapBoth f g

mapBoth : (Float -> Float) -> (Float -> Float) -> Point -> Point
mapBoth = Tuple.mapBoth

mapSame : (Float -> Float) -> Point -> Point
mapSame f = Tuple.mapBoth f f

map2 : (Float -> Float -> Float, Float -> Float -> Float) -> Point -> Point -> Point
map2 (f, g) p1 p2 =
  let
    xpos = f (Tuple.first p1) (Tuple.first p2)
    ypos = g (Tuple.second p1) (Tuple.second p2)
  in
    (xpos, ypos)

mapBoth2 : (Float -> Float -> Float) -> (Float -> Float -> Float) -> Point -> Point -> Point
mapBoth2 f g = map2 (f, g)

mapSame2 : (Float -> Float -> Float) -> Point -> Point -> Point
mapSame2 f = map2 (f, f)


mapX : (Float -> Float) -> Point -> Point
mapX f = Tuple.mapFirst f

mapY : (Float -> Float) -> Point -> Point
mapY f = Tuple.mapSecond f


mapPolygon : (Point -> Point) -> Polygon -> Polygon
mapPolygon f = List.map f

mapShape : (Point -> Point) -> Shape -> Shape
mapShape f shape =
  case shape of
    Polygon ps ->
      Polygon (mapPolygon f ps)
    Composite outline holes ->
      Composite (mapPolygon f outline) (List.map (mapPolygon f) holes)

mapPath : (Point -> Point) -> Path -> Path
mapPath f path =
  case path of
    Path ps -> Path <| List.map f ps


reduce : (Float -> Float -> a) -> Point -> a
reduce f (x, y) = f x y


translateShape : (Float, Float) -> Shape -> Shape
translateShape vec = mapShape (mapSame2 (+) vec)



minCoords : Point -> Point -> Point
minCoords = mapSame2 min

maxCoords : Point -> Point -> Point
maxCoords = mapSame2 max

dimensions : Point -> Point -> (Float, Float)
dimensions = mapSame2 (\i j -> abs <| i - j)


distance : Point -> Point -> Float
distance (x1, y1) (x2, y2) = sqrt <| ((x2 - x1) ^ 2) + ((y2 - y1) ^ 2)

minDistance : Point -> Point -> Point -> Point
minDistance base p1 p2 =
  let
    dist1 = distance base p1
    dist2 = distance base p2
  in
    if (dist1 < dist2) then p1 else p2

maxDistance : Point -> Point -> Point -> Point
maxDistance base p1 p2 =
  let
    dist1 = distance base p1
    dist2 = distance base p2
  in
    if (dist1 > dist2) then p1 else p2



pointsToLines : List Point -> List (Point, Point)
pointsToLines list =
  case list of
    [] -> []
    p::ps ->
      let
        recurse xs = case xs of
          [] -> []
          x :: [] -> [(x, p)]
          x :: y :: more ->
            (x, y) :: recurse (y :: more)
      in
        recurse list



-- If two shapes overlap, return their union; if not, return Nothing
union : Shape -> Shape -> Maybe Shape
union a b = Nothing


-- If two shapes overlap, return their intersection; if not, return Nothing
intersection : Shape -> Shape -> Maybe Shape
intersection a b = Nothing


-- If two shapes overlap, return the first minus the second; if not, return Nothing
complement : Shape -> Shape -> Maybe Shape
complement a b = Nothing




line_intersect : (Point, Point) -> (Point, Point) -> Maybe Point
line_intersect line_1 line_2 =
  (calc_point line_1 line_2) |> Maybe.andThen (check_bounds line_1 line_2)


-- Adapted from https://www.geeksforgeeks.org/program-for-point-of-intersection-of-two-lines/
calc_point : (Point, Point) -> (Point, Point) -> Maybe Point
calc_point ((p1_x, p1_y), (p2_x, p2_y)) ((q1_x, q1_y), (q2_x, q2_y)) =
  let
    p_a = p2_y - p1_y
    p_b = p1_x - p2_x
    p_c = (p_a * p1_x) + (p_b * p1_y)

    q_a = q2_y - q1_y
    q_b = q1_x - q2_x
    q_c = (q_a * q1_x) + (q_b * q1_y)

    determinant = p_a * q_b - q_a * p_b

  in
    if determinant == 0 then
      Nothing
    else
      Just ( (q_b*p_c - p_b*q_c) / determinant, (p_a*q_c - q_a*p_c) / determinant)


check_bound : Line -> Point -> Maybe Point
check_bound ((p1_x, p1_y), (p2_x, p2_y)) (x, y) =
  let
    (p_x_min, p_x_max) = (min p1_x p2_x, max p1_x p2_x)
    (p_y_min, p_y_max) = (min p1_y p2_y, max p1_y p2_y)
  in
    if (p_x_min <= x && x <= p_x_max && p_y_min <= y && y <= p_y_max) then
      Just (x,y)
    else
      Nothing

check_bounds : (Point, Point) -> (Point, Point) -> Point -> Maybe Point
check_bounds line_1 line_2 pt =
  Maybe.andThen (check_bound line_2) (check_bound line_1 pt)




solve_for_x : Float -> Line -> Maybe Float
solve_for_x y ((x1, y1), (x2, y2)) =
  if (x1 == x2) then
    if (y1 == y2) then Nothing else Just x1
  else
    let
      m = (y2 - y1) / (x2 - x1)
    in
      Just <| x1 + ((y - y1) / m)



point_inside_polygon : Point -> Polygon -> Bool
point_inside_polygon (x,y) poly =
  let
    check_x (n,_) = if n >= x then Just n else Nothing
    shape_lines = pointsToLines poly

    maybe_to_bool m = case m of
      Nothing  -> False
      Just foo -> True

    intersects_horizontal line =
      if isHorizontal line then
        check_bound line (x,y)
          |> Maybe.map Tuple.first
      else
        solve_for_x y line
          |> Maybe.andThen (\n -> check_bound line (n, y))
          |> Maybe.andThen check_x

    ends_on_horizontal ((p_x, p_y), (q_x, q_y)) =
      p_y /= y && q_y == y && q_x >= x

    intersections = List.map intersects_horizontal shape_lines

    num_intersections = intersections
      |> List.map maybe_to_bool
      |> List.filter identity
      |> List.length

    num_ends = List.map ends_on_horizontal shape_lines
      |> List.filter identity
      |> List.length

    on_outline = List.foldl (\n acc -> acc || n == Just x) False intersections

  in
    on_outline || modBy 2 (num_intersections - num_ends) == 1


pointInsideShape : Point -> Shape -> Bool
pointInsideShape pt shape =
  case shape of
    Polygon ps -> point_inside_polygon pt ps
    Composite outline holes ->
      if point_inside_polygon pt outline then
        List.foldl (\x acc -> acc || point_inside_polygon pt x) False holes
      else
        False


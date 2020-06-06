module Grid exposing (..)

import List.Extra as ListE
import Maybe.Extra as MaybeE

import Cycle exposing (Cycle)

type alias Point = (Float, Float)

type alias Line = (Point, Point)
type alias Polygon = List Point

type Shape
  = Polygon   Polygon
  | Composite Polygon (List Polygon)

type Path = Path (List Point)


type Direction
  = Clockwise
  | Widdershins


-- Making Basic Shapes -----------------------------------------------

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


compositeFromTuple : (Polygon, List Polygon) -> Shape
compositeFromTuple (outline, holes) = Composite outline holes

fromOutlineAndHoles : (Polygon, List Polygon) -> Shape
fromOutlineAndHoles (outline, holes) =
  case holes of
    [] -> Polygon outline
    _  -> Composite outline holes



extractMatch : (a -> Bool) -> List a -> Maybe (a, List a)
extractMatch f list =
  case list of
    [] -> Nothing
    x::xs ->
      if f x then
        Just (x, xs)
      else
        Maybe.map (Tuple.mapSecond ((::) x)) (extractMatch f xs)


flatten : Shape -> Polygon
flatten shape =
  case shape of
    Polygon poly -> poly

    Composite outline holes ->

      let
        corrected_holes =
          List.map (set_direction << opposite_dir << direction <| outline) holes
          |> List.map make_loop

        make_loop list = case list of
          [] -> []
          (x::xs) -> list ++ [x]

        clear_shot pt sh =
          case sh of
            [] -> False
            v::vs ->
              let
                tentative_line = (pt, v)

                check_clear hole =
                  let
                    cross_pts =
                      line_intersect_polygon tentative_line hole
                        |> List.filter (\x -> x /= v && x /= pt)
                  in
                    case cross_pts of
                      [] -> True
                      _  -> False

                intersections = List.map check_clear corrected_holes
              in
                List.foldl (&&) True intersections

        recurse_outline remaining_points remaining_holes =
          case remaining_points of
            [] -> []
            pt::pts ->
              case extractMatch (clear_shot pt) remaining_holes of

                -- If no open paths to any holes, move on to the next point
                Nothing ->
                  pt :: recurse_outline pts remaining_holes

                -- If an open path, jump to that hole and return to this point
                Just (next_hole, other_holes) ->
                  let
                    (new_segment, new_remaining_holes) = (recurse_hole next_hole other_holes)
                  in
                    pt :: new_segment ++ (recurse_outline remaining_points new_remaining_holes)

        recurse_hole remaining_points remaining_holes =
          case remaining_points of
            [] -> ([], remaining_holes)
            pt::pts ->

              -- Try and find an open path to another hole
              case extractMatch (clear_shot pt) remaining_holes of

                -- If no open paths to any other holes, move on to the next point
                Nothing ->
                  Tuple.mapFirst ((::) pt) <| recurse_hole pts remaining_holes

                -- If an open path, jump to that hole, then finish this one
                Just (next_hole, other_holes) ->
                  let
                    recursive_call = recurse_hole next_hole other_holes
                  in
                    Tuple.mapFirst (\xs -> pt :: xs ++ (pt::pts)) recursive_call

      in
        case outline of
          [] -> []
          start::tail ->
              recurse_outline outline corrected_holes




-- Various Map Functions ---------------------------------------------

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




-- Misc Basic Point and Shape Functions ------------------------------

numPoints : Shape -> Int
numPoints shape = case shape of
  Polygon ps -> List.length ps
  Composite outline holes ->
    (List.length outline) + List.sum (List.map List.length holes)


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



direction : Polygon -> Direction
direction poly =
  let
    lines = pointsToLines poly
    line_val (p,q) = reduce (*) <| mapBoth2 (+) (-) q p
    total_val = List.sum <| List.map line_val lines
  in
    if total_val < 0 then Widdershins else Clockwise

reverse : Polygon -> Polygon
reverse = List.reverse


set_direction : Direction -> Polygon -> Polygon
set_direction dir poly =
  if dir == direction poly then
    poly
  else
    reverse poly

opposite_dir : Direction -> Direction
opposite_dir dir = case dir of
  Clockwise -> Widdershins
  Widdershins -> Clockwise






-- Merging Shapes ----------------------------------------------------

-- If two shapes overlap, return their union; if not, return Nothing
union : Shape -> Shape -> Maybe Shape
union a b =
  case (a, b) of
    (Polygon a_poly, Polygon b_poly) ->
      union_polygons a_poly b_poly
      |> Maybe.map fromOutlineAndHoles
    _ -> Nothing


-- If two shapes overlap, return their intersection; if not, return Nothing
intersection : Shape -> Shape -> Maybe (List Shape)
intersection a b =
  case (a, b) of
    (Polygon a_poly, Polygon b_poly) ->
      intersect_polygons a_poly b_poly
      |> Maybe.map (List.map Polygon)

    _ -> Nothing


-- If two shapes overlap, return the first minus the second; if not, return Nothing
complement : Shape -> Shape -> Maybe (List Shape)
complement a b = Nothing




-- Merging Shapes Helper Functions -----------------------------------


-- Create a new version of poly that explicitly includes all the points where it intersects
-- with outline. If no such intersection points exist, return Nothing
insert_intersection_points : Polygon -> Polygon -> Maybe Polygon
insert_intersection_points poly outline =
  let
    (poly_lines, outline_lines) = (pointsToLines poly, pointsToLines outline)

    recurse lines outline_ =
      case lines of
        [] -> []
        (p,q)::rest ->
          let
            curr_intersects =
              List.map (line_intersect (p,q)) outline_
                |> MaybeE.values
                |> order_points (p,q)
          in
            (p :: curr_intersects) ++ (recurse rest outline_)

    new_pts = recurse poly_lines outline_lines

  in
    if (new_pts == poly) then Nothing else Just new_pts


-- Return the two polygons with all intersection points filled in
create_intersections : Polygon -> Polygon -> Maybe (Polygon, Polygon, List Point)
create_intersections poly_a poly_b =
  let
    (a_lines, b_lines) = (pointsToLines poly_a, pointsToLines poly_b)

    sects = List.map (\p -> List.map (\q -> line_intersect p q) a_lines) b_lines
      |> List.concat
      |> MaybeE.values
  in
    case sects of
      [] -> Nothing
      _  -> case (insert_intersection_points poly_a poly_b, insert_intersection_points poly_b poly_a) of
        (Just new_a, Just new_b) -> Just (new_a, new_b, sects)
        _ -> Nothing


trace_polygons : Cycle.Dir -> (List Point -> Polygon -> Cycle Point -> Bool)
              -> Cycle.WeaveDecFunc Point -> Cycle.WeaveDecFunc Point
              -> Polygon -> Polygon
              -> Maybe (List Polygon)
trace_polygons initial_d valid_start switch_func_a switch_func_b poly_a poly_b =
  let

    init_recurse : (Polygon, Polygon, List Point) -> List Polygon
    init_recurse (poly_a_i, poly_b_i, sects) =
      recurse (Cycle.fromList poly_a_i) (Cycle.fromList poly_b_i) sects

    recurse : Cycle Point -> Cycle Point -> List Point -> List Polygon
    recurse cyc_a cyc_b sects =
      if sects == [] then [] else
      let

        shift_to_intersection cyc_x poly_y =
          Cycle.shiftUntilWhole (valid_start sects poly_y) cyc_x

        perform_weave cyc_x =
          Cycle.weaveMatchDiff (==) switch_func_a switch_func_b initial_d cyc_x cyc_b

        remaining_sects s = List.filter (\x -> not <| List.member x s) sects

      in
        case shift_to_intersection cyc_a poly_b of
          Nothing -> []
          Just shifted_a ->
            let new_shape = perform_weave shifted_a in
            new_shape :: recurse shifted_a cyc_b (remaining_sects new_shape)

  in
    create_intersections poly_a poly_b |> Maybe.map init_recurse



-- Turns out, this bad boy will do union, intersection, and either complement depending on
-- the direction (clockwise/anticlockwise) of both shapes
trace_polygons_maker : Cycle.Dir -> Polygon -> Polygon -> Maybe (List Polygon)
trace_polygons_maker initial_d poly_a poly_b =
  let

    mb_point_inside_a = MaybeE.unwrap False (\pt -> point_inside_polygon pt poly_a)
    mb_point_inside_b = MaybeE.unwrap False (\pt -> point_inside_polygon pt poly_b)

    switch_a : Cycle.WeaveDecFunc Point
    switch_a _ cyc_a cyc_b _ =
      if initial_d == Cycle.Forward && mb_point_inside_b (Cycle.next cyc_a) then
        Just {dir = Cycle.Forward, switch = True}
      else
      if mb_point_inside_b (Cycle.prev cyc_a) then
        Just {dir = Cycle.Backward, switch = True}
      else
      if mb_point_inside_b (Cycle.next cyc_a) then
        Just {dir = Cycle.Forward, switch = True}
      else
        Nothing

    switch_b : Cycle.WeaveDecFunc Point
    switch_b _ cyc_a cyc_b _ =
      if initial_d == Cycle.Forward && mb_point_inside_a (Cycle.next cyc_b) then
        Just {dir = Cycle.Forward, switch = True}
      else
      if mb_point_inside_a (Cycle.prev cyc_b) then
        Just {dir = Cycle.Backward, switch = True}
      else
      if mb_point_inside_a (Cycle.next cyc_b) then
        Just {dir = Cycle.Forward, switch = True}
      else
        Nothing

    valid_start : List Point -> Polygon -> Cycle Point -> Bool
    valid_start sects poly cyc =
      case (Cycle.current cyc, Cycle.prev cyc) of
        (Just curr, Just prv) ->
          List.member curr sects && not (point_inside_polygon prv poly)
        _ -> False

  in
    trace_polygons initial_d valid_start switch_a switch_b poly_a poly_b



filterSplit : (a -> Bool) -> List a -> (List a, List a)
filterSplit f list =
  case list of
    [] -> ([], [])
    x::xs ->
      if f x then
        Tuple.mapFirst ((::) x) <| filterSplit f xs
      else
        Tuple.mapSecond ((::) x) <| filterSplit f xs

determine_outline : List Polygon -> Maybe (Polygon, List Polygon)
determine_outline p_list =
  case p_list of
    []    -> Nothing
    p::[] -> Just (p, [])
    p::ps ->
      let
        results = List.head p
          |> Maybe.map (\pt -> filterSplit (\q -> point_inside_polygon pt q) ps)
      in
        case results of
          Nothing -> Nothing
          Just (candidates, holes) -> case candidates of
            [] -> Just (p, holes)
            _  -> Maybe.map (Tuple.mapSecond ((++) holes)) <| determine_outline candidates


get_inner : Polygon -> Polygon -> Maybe Polygon
get_inner poly_a poly_b = Maybe.map Tuple.second <| get_outer_inner poly_a poly_b

get_outer : Polygon -> Polygon -> Maybe Polygon
get_outer poly_a poly_b = Maybe.map Tuple.first  <| get_outer_inner poly_a poly_b

get_outer_inner : Polygon -> Polygon -> Maybe (Polygon, Polygon)
get_outer_inner poly_a poly_b =
  let
    x_in_y x y = List.foldl (&&) True <| List.map (\pt -> point_inside_polygon pt y) x
  in
    if x_in_y poly_a poly_b then Just (poly_b, poly_a) else
    if x_in_y poly_b poly_a then Just (poly_a, poly_b) else
    Nothing



union_polygons : Polygon -> Polygon -> Maybe (Polygon, List Polygon)
union_polygons poly_a poly_b =
  let
    corrected_b = set_direction (direction poly_a) poly_b

    make_trace a b = trace_polygons_maker Cycle.Backward a b
      |> Maybe.andThen determine_outline

    take_outer a b = get_outer a b
      |> Maybe.map (\x -> (x, []))
  in
    MaybeE.orListLazy
      [ \() -> make_trace poly_a corrected_b
      , \() -> take_outer poly_a poly_b
      ]

intersect_polygons : Polygon -> Polygon -> Maybe (List Polygon)
intersect_polygons poly_a poly_b =
  let
    corrected_b = set_direction (opposite_dir <| direction poly_a) poly_b

    make_trace = trace_polygons_maker Cycle.Forward

    take_inner a b = get_inner a b
      |> Maybe.map List.singleton
  in
    MaybeE.orListLazy
      [ \() -> make_trace poly_a corrected_b
      , \() -> take_inner poly_a poly_b
      ]

complement_polygons : Polygon -> Polygon -> Maybe (List Polygon)
complement_polygons poly_a poly_b =
  let
    (dir_a, dir_b) = (direction poly_a, direction poly_b)
  in
    if (dir_a == dir_b) then
      trace_polygons_maker Cycle.Forward  poly_a poly_b
    else
      trace_polygons_maker Cycle.Backward poly_b poly_a







-- Points & Lines ----------------------------------------------------

order_points : Line -> List Point -> List Point
order_points (p, _) = List.sortBy (distance p)

pointsToLines : List Point -> List (Point, Point)
pointsToLines list =
  --listPairsWrap
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




slope : Line -> Maybe Float
slope ((p_x, p_y), (q_x, q_y)) =
  if p_x == q_x then
    Nothing
  else
    Just <| (q_y - p_y) / (q_x - p_x)

isHorizontal : Line -> Bool
isHorizontal (p, q) =
  case slope (p, q) of
    Nothing -> False
    Just m -> m == 0

slope_intercept : Line -> Maybe (Float, Float)
slope_intercept ((p_x, p_y), (q_x, q_y)) =
  if p_x == q_x then
    Nothing
  else
    let
      m = (q_y - p_y) / (q_x - p_x)
      b = p_y - (m * p_x)
    in
      Just (m, b)

colinear : Point -> Point -> Point -> Bool
colinear p q r =
  -- If any two points are equal, then two points are colinear by default
  if p == q || q == r || p == r then
    True
  else
    slope_intercept (p, q) == slope_intercept (q, r)


pointOnLine : Point -> Line -> Maybe Point
pointOnLine p (q, r) =
  if colinear p q r then check_bound (q, r) p else Nothing



solve_for_x : Float -> Line -> Maybe Float
solve_for_x y ((x1, y1), (x2, y2)) =
  if (x1 == x2) then
    if (y1 == y2) then Nothing else Just x1
  else
    let
      m = (y2 - y1) / (x2 - x1)
    in
      Just <| x1 + ((y - y1) / m)


line_intersect_polygon : (Point, Point) -> Polygon -> List Point
line_intersect_polygon line poly =
  let
    shape_lines = pointsToLines poly
  in
    List.map (line_intersect line) shape_lines |> MaybeE.values




-- Points & Shapes ---------------------------------------------------


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


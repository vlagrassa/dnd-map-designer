module Utils exposing (..)


-- Find the first element for which some function returns True, and remove it from
-- the rest of the list
extractMatch : (a -> Bool) -> List a -> Maybe (a, List a)
extractMatch f list =
  case list of
    [] -> Nothing
    x::xs ->
      if f x then
        Just (x, xs)
      else
        Maybe.map (Tuple.mapSecond ((::) x)) (extractMatch f xs)


-- Cartesian Product
cart_prod : (a -> b -> c) -> List a -> List b -> List c
cart_prod f a_list b_list =
  List.concatMap (\b -> List.map (\a -> f a b) a_list) b_list


-- Pair each element with the next element in the list, wrapping around to the front
listPairsWrap : List x -> List (x, x)
listPairsWrap list =
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


-- Pair each element with the next two elements in the list, wrapping around to the front
listTriplesWrap : List x -> List (x, x, x)
listTriplesWrap list =
  case list of
    []    -> []
    b::[] -> []
    a::b::tail ->
      let
        recurse xs = case xs of
          [] -> []
          y::[]         -> [(y,a,b)]
          x::y::[]      -> [(x,y,a), (y,a,b)]
          x::y::z::more -> (x,y,z) :: (recurse <| y::z::more)
      in
        recurse list


-- Combine two maybe values if both exist, otherwise take whichever one exists
maybeCombine : (a -> a -> a) -> Maybe a -> Maybe a -> Maybe a
maybeCombine f ma mb =
  case (ma, mb) of
    (Nothing, Nothing) -> Nothing
    (Just a,  Nothing) -> Just a
    (Nothing, Just b ) -> Just b
    (Just a,  Just b ) -> Just <| f a b

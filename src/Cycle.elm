module Cycle exposing (..)

import List.Extra as ListE
import Maybe.Extra as MaybeE



type Cycle a
  = Empty
  | Cycle (List a) a (List a)

type Dir = Forward | Backward



-- Converting To/From Lists ------------------------------------------

fromList : List a -> Cycle a
fromList list =
  case list of
    [] -> Empty
    x::xs -> Cycle [] x xs

toList : Cycle a -> List a
toList cyc = case cyc of
  Empty -> []
  Cycle cba n xyz -> (List.reverse cba) ++ [n] ++ xyz

toListCurrent : Cycle a -> List a
toListCurrent cyc = case cyc of
  Empty -> []
  Cycle cba n xyz -> n :: xyz ++ (List.reverse cba)



-- Getting length ----------------------------------------------------

length : Cycle a -> Int
length cyc = case cyc of
  Empty -> 0
  Cycle cba n xyz -> List.length cba + List.length xyz + 1

lengths : Cycle a -> (Int, Int)
lengths cyc = case cyc of
  Empty -> (0,0)
  Cycle cba _ xyz -> (List.length cba, List.length xyz)



-- Get elements ------------------------------------------------------

current : Cycle a -> Maybe a
current cyc = case cyc of
  Empty -> Nothing
  Cycle _ n _ -> Just n

prev : Cycle a -> Maybe a
prev cyc = case cyc of
  Empty -> Nothing
  Cycle []      _ xyz -> ListE.last xyz
  Cycle (c::ba) _ _   -> Just c

next : Cycle a -> Maybe a
next cyc = case cyc of
  Empty -> Nothing
  Cycle cba _ []      -> ListE.last cba
  Cycle _   _ (x::yz) -> Just x

neighbors : Cycle a -> Maybe (a, a)
neighbors cyc = case cyc of
  Empty -> Nothing
  Cycle _ _ _ -> case (prev cyc, next cyc) of
    (Just p, Just n) -> Just (p, n)
    _ -> Nothing



-- List-like functions------------------------------------------------

map : (a -> b) -> Cycle a -> Cycle b
map f cyc = case cyc of
  Empty -> Empty
  Cycle cba n xyz -> Cycle (List.map f cba) (f n) (List.map f xyz)

reverse : Cycle a -> Cycle a
reverse cyc = case cyc of
  Empty -> Empty
  Cycle cba n xyz -> Cycle (List.reverse xyz) n (List.reverse cba)



-- Stepping through the Cycle ----------------------------------------

stepForward : Cycle a -> Cycle a
stepForward cyc = case cyc of
  Empty -> Empty
  Cycle [] n [] -> Cycle [] n []
  Cycle xs n (y::ys) -> Cycle (n::xs) y ys
  Cycle xs n [] ->
    case List.reverse xs of
      [] -> Debug.todo "Not possible"
      x::xs_ -> Cycle [n] x xs_

stepBackward : Cycle a -> Cycle a
stepBackward cyc = case cyc of
  Empty -> Empty
  Cycle [] n [] -> Cycle [] n []
  Cycle (c::ba) n xyz -> Cycle ba c (n::xyz)
  Cycle [] n xyz ->
    case List.reverse xyz of
      [] -> Debug.todo "Not possible"
      z::yx -> Cycle yx z [n]

step : Dir -> Cycle a -> Cycle a
step dir = case dir of
  Forward  -> stepForward
  Backward -> stepBackward


shift : Int -> Cycle a -> Cycle a
shift amount cyc =
  case cyc of
    Empty -> Empty
    Cycle cba n xyz ->
      let
        (h_len, t_len) = lengths cyc
        len = h_len + t_len + 1

        num = modBy len amount

        recurse_t i cyc_ = if i == 0 then cyc_ else recurse_t (i-1) (stepForward cyc_)
        recurse_h i cyc_ = if i == 0 then cyc_ else recurse_h (i-1) (stepBackward cyc_)

      in
        if (num < t_len) then recurse_t num cyc else recurse_h (abs <| num - len) cyc

shiftDir : Dir -> Int -> Cycle a -> Cycle a
shiftDir dir n =
  case dir of
    Forward  -> shift n
    Backward -> shift (-1 * n)


shiftToMatch : (a -> Bool) -> Cycle a -> Maybe (Cycle a)
shiftToMatch success cyc =
  case cyc of
    Empty -> Nothing
    Cycle cba n xyz ->
      let
        in_list : List a -> Int -> Maybe Int
        in_list list acc =
          case list of
            [] -> Nothing
            x :: xs -> if success x then Just acc else in_list xs (acc+1)

        in_left = \() -> Maybe.map ((*) -1) (in_list cba 1)
        in_right = in_list xyz 1
      in
        MaybeE.orLazy in_right in_left |> Maybe.map (\i -> shift i cyc)

shiftTo : a -> Cycle a -> Maybe (Cycle a)
shiftTo a = shiftToMatch ((==) a)



-- Weaving -----------------------------------------------------------

weave : (Cycle a -> Cycle a -> Maybe Dir) -> Cycle a -> Cycle a -> List a
weave = weaveMatch (==)

weaveMatch : (a -> a -> Bool) -> (Cycle a -> Cycle a -> Maybe Dir) -> Cycle a -> Cycle a -> List a
weaveMatch match_func choose_dir c_1 c_2 =
  let
    recurse main_cycle other_cycle dir start_pt =
      case main_cycle of
        Empty -> []
        Cycle _ n _ ->

          -- Base Case - Terminate once you've found the original token
          if n == start_pt then [n] else
          case shiftToMatch (match_func n) other_cycle of

            -- No match in the other cycle -- keep going with this one
            Nothing -> n :: (recurse (step dir main_cycle) other_cycle dir start_pt)

            -- If match, then
            Just other_cycle_shifted -> case other_cycle_shifted of
              Empty -> Debug.todo "Not Possible"

              Cycle _ _ _ ->
                case choose_dir main_cycle other_cycle_shifted of
                  Nothing -> n :: (recurse (step dir main_cycle) other_cycle dir start_pt)

                  Just new_dir -> recurse other_cycle_shifted main_cycle new_dir start_pt

  in
    case current c_1 of
      Nothing -> []
      Just pt -> recurse (stepForward c_1) c_2 Forward pt

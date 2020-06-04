module Cycle exposing (..)

import List.Extra as ListE
import Maybe.Extra as MaybeE



type Cycle a
  = Empty
  | Cycle (List a) a (List a)

type Dir = Forward | Backward

type alias WeaveDecFunc a = a -> Cycle a -> Cycle a -> WeaveDec -> Maybe WeaveDec

type alias WeaveDec =
  { dir : Dir
  , switch : Bool
  }



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


removeCurrent : Cycle a -> Maybe (a, Cycle a)
removeCurrent cyc = case cyc of
  Empty -> Nothing
  Cycle cba n xyz -> case xyz of
    x::yz -> Just (n, Cycle cba x yz)
    [] ->
      case List.reverse cba of
        [] -> Just (n, Empty)
        a::bc  -> Just (n, Cycle [] a bc)

insertPrev : a -> Cycle a -> Cycle a
insertPrev k cyc = case cyc of
  Empty -> Cycle [] k []
  Cycle cba n xyz -> Cycle (k::cba) n xyz

insertNext : a -> Cycle a -> Cycle a
insertNext k cyc = case cyc of
  Empty -> Cycle [] k []
  Cycle cba n xyz -> Cycle cba n (k::xyz)

insertBefore : a -> Cycle a -> Cycle a
insertBefore k cyc = case cyc of
  Empty -> Cycle [] k []
  Cycle cba n xyz -> Cycle cba k (n::xyz)

insertAfter : a -> Cycle a -> Cycle a
insertAfter k cyc = case cyc of
  Empty -> Cycle [] k []
  Cycle cba n xyz -> Cycle (n::cba) k xyz


-- List-like functions------------------------------------------------

map : (a -> b) -> Cycle a -> Cycle b
map f cyc = case cyc of
  Empty -> Empty
  Cycle cba n xyz -> Cycle (List.map f cba) (f n) (List.map f xyz)

reverse : Cycle a -> Cycle a
reverse cyc = case cyc of
  Empty -> Empty
  Cycle cba n xyz -> Cycle (List.reverse xyz) n (List.reverse cba)

member: a -> Cycle a -> Bool
member t cyc = case cyc of
  Empty -> False
  Cycle cba n xyz -> t == n || List.member t cba || List.member t xyz



-- Stepping through the Cycle ----------------------------------------

toFirst : Cycle a -> Cycle a
toFirst cyc = case cyc of
  Empty -> Empty
  Cycle cba n xyz ->
    case List.reverse cba of
      []    -> cyc
      a::bc -> Cycle [] a (bc ++ [n] ++ xyz)

toLast : Cycle a -> Cycle a
toLast cyc = case cyc of
  Empty -> Empty
  Cycle cba n xyz ->
    case List.reverse xyz of
      []    -> cyc
      z::yx -> Cycle (yx ++ [n] ++ cba) z []

stepForward : Cycle a -> Cycle a
stepForward cyc = case cyc of
  Empty -> Empty
  Cycle []  n [] -> Cycle [] n []
  Cycle cba n (x::yz) -> Cycle (n::cba) x yz
  Cycle cba n [] ->
    case List.reverse (n::cba) of
      []     -> cyc
      a::bcn -> Cycle [] a bcn

stepBackward : Cycle a -> Cycle a
stepBackward cyc = case cyc of
  Empty -> Empty
  Cycle [] n [] -> Cycle [] n []
  Cycle (c::ba) n xyz -> Cycle ba c (n::xyz)
  Cycle [] n xyz ->
    case List.reverse (n::xyz) of
      []     -> cyc
      z::yxn -> Cycle yxn z []

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

shiftToMatchWhole : (Cycle a -> Bool) -> Cycle a -> Maybe (Cycle a)
shiftToMatchWhole success cyc =
  let
    recurse cyc_ = case cyc_ of
      Empty -> if success Empty then Just Empty else Nothing
      Cycle _ _ xyz ->
        if success cyc_ then Just cyc_ else case xyz of
          [] -> Nothing
          _  -> recurse (stepForward cyc_)
      --Cycle _ _ [] -> if success cyc_ then Just cyc_ else Nothing
      --Cycle _ _ _  -> if success cyc_ then Just cyc_ else recurse (stepForward cyc_)
  in
    recurse (toFirst cyc)

shiftTo : a -> Cycle a -> Maybe (Cycle a)
shiftTo a = shiftToMatch ((==) a)



-- Weaving -----------------------------------------------------------

weave : WeaveDecFunc a -> Dir -> Cycle a -> Cycle a -> List a
weave = weaveMatch (==)

weaveMatch : (a -> a -> Bool) -> WeaveDecFunc a -> Dir -> Cycle a -> Cycle a -> List a
weaveMatch match_func decision_func init_dir c_1 c_2 =
  let

    recurse : Cycle a -> Cycle a -> WeaveDec -> a -> List a
    recurse main_cycle other_cycle last_dec start_pt =
      --if (counter == 0) then [] else
      --case dec of
      --  Nothing -> []
      --  Just d  ->

        case main_cycle of
          Empty -> []
          Cycle _ n _ ->

            -- Base Case - Terminate once you've found the original token
            if n == start_pt then [] else

            case shiftToMatch (match_func n) other_cycle of

              -- No match in the other cycle -- keep going with this one
              Nothing -> n :: (recurse (step last_dec.dir main_cycle) other_cycle last_dec start_pt)

              -- If match, then
              Just other_cycle_shifted -> case other_cycle_shifted of
                Empty -> Debug.todo "Not Possible"

                Cycle _ _ _ ->
                  case decision_func n main_cycle other_cycle_shifted last_dec of
                    Nothing -> []
                    --Nothing -> n :: (recurse (step dir main_cycle) other_cycle dir start_pt)

                    Just new_dec ->
                      if new_dec.switch then
                        n :: (recurse (step new_dec.dir other_cycle_shifted) main_cycle new_dec start_pt)
                      else
                        n :: (recurse (step new_dec.dir main_cycle) other_cycle_shifted new_dec start_pt)

  in
    case current c_1 of
      Nothing -> []
      Just pt -> pt :: (recurse (step init_dir c_1) c_2 {dir=init_dir, switch=True} pt)
        --[pt]




weaveMatchDiff : (a -> a -> Bool) -> WeaveDecFunc a -> WeaveDecFunc a -> Dir -> Cycle a -> Cycle a -> List a
weaveMatchDiff match_func decision_func_1 decision_func_2 init_dir c_1 c_2 =
  let
    decision_func b = if b then decision_func_1 else decision_func_2

    recurse : Bool -> Cycle a -> Cycle a -> WeaveDec -> a -> Int -> List a
    recurse first_cycle main_cycle other_cycle last_dec start_pt counter =
      --if (counter == 0) then [] else
      case main_cycle of
        Empty -> []
        Cycle _ n _ ->

          -- Base Case - Terminate once you've found the original token
          if n == start_pt then [] else
          case shiftToMatch (match_func n) other_cycle of

            -- No match in the other cycle -- keep going with this one
            Nothing -> n :: (recurse first_cycle (step last_dec.dir main_cycle) other_cycle last_dec start_pt (counter - 1))

            -- If match, then
            Just other_cycle_shifted -> case other_cycle_shifted of
              Empty -> Debug.todo "Not Possible"

              Cycle _ _ _ ->
                case decision_func first_cycle n main_cycle other_cycle_shifted last_dec of
                  Nothing -> []

                  Just new_dec ->
                    if new_dec.switch then
                      n :: (recurse (not first_cycle) (step new_dec.dir other_cycle_shifted) main_cycle new_dec start_pt (counter - 1))
                    else
                      n :: (recurse first_cycle (step new_dec.dir main_cycle) other_cycle new_dec start_pt (counter - 1))

  in
    case current c_1 of
      Nothing -> []
      Just pt ->
        -- recurse True (stepForward c_1) c_2 Forward pt 15
        pt :: (recurse True (step init_dir c_1) c_2 {dir=init_dir, switch=True} pt 50)



makeWeaver : (Cycle a -> a -> Bool) -> (Cycle a -> Cycle a -> Maybe Dir)
makeWeaver f curr other =
  let
    f_ = f other
  in
    case neighbors other of
      Nothing -> Nothing
      Just (prev_pt, next_pt) ->
        if f_ prev_pt then
          Just Backward
        else if f_ next_pt then
          Just Forward
        else
          Nothing


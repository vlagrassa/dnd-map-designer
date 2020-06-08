module Stack exposing (..)

type Stack a = S (Int, List a)

empty : Int -> Stack a
empty n = S (n, [])

isEmpty : Stack a -> Bool
isEmpty s =
  case s of
    S (_, []) -> True
    _ -> False

push : a -> Stack a -> Stack a
push x (S (n, xs)) =
  if List.length xs >= n then
    S (n, x::(List.take (n - 1) xs))
  else
    S (n, x::xs)

pop : Stack a -> Maybe (a, Stack a)
pop (S (n, xs)) =
  case xs of
    [] -> Nothing
    hd::tl -> Just (hd, S (n, tl))

peek : Stack a -> Maybe a
peek (S (n, xs)) =
  case xs of
    [] -> Nothing
    hd::_ -> Just hd

#!/bin/bash
# Simple make command

# See https://stackoverflow.com/questions/59895/how-to-get-the-source-directory-of-a-bash-script-from-within-the-script-itself
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

elm make "$DIR"/src/Main.elm --output="$DIR"/build/elm-app.js

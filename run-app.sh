#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ -f "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" ]; then
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" --app="file://$DIR/index.html" --window-size=400,900 &
elif [ -f "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --app="file://$DIR/index.html" --window-size=400,900 &
else
  open "$DIR/index.html"
fi

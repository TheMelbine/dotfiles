#!/bin/sh

WORKDIR="$HOME/.config/ags"

function _ags() {
  pkill ags
  nohup ags 
}

# Запускаем ags при старте скрипта
_ags

inotifywait --quiet --monitor --event create,modify,delete --recursive $WORKDIR | while read DIRECTORY EVENT FILE; do
  file_extension=${FILE##*.}
  if [ "$file_extension" = "js" ]; then
    echo "Reload JS..."
    _ags
  fi
done

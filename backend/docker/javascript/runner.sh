#!/bin/sh

if [ ! -f code.js ]; then
  echo "Execution Error"
  exit 1
fi

node code.js
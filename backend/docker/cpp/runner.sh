#!/bin/sh

g++ code.cpp -o app
if [ $? -ne 0 ]; then
  echo "Execution Error"
  exit 1
fi

./app
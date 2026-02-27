#!/bin/sh

javac Main.java
if [ $? -ne 0 ]; then
  echo "Execution Error"
  exit 1
fi

java Main
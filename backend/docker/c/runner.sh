#!/bin/sh
gcc code.c -O2 -o output 2> compile_error.txt

if [ -f output ]; then
    timeout 5s ./output
else
    cat compile_error.txt
fi
#!/bin/bash

result=$(echo 'cat //test-run/@result' | xmllint --shell ./results/test-output.xml | awk -F'[="]' '!/>/{print $(NF-1)}')
if test "$result" = "Passed"
then
    exit 0;
else
    exit 1;
fi
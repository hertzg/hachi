#!/bin/bash
cd `dirname $BASH_SOURCE`
for i in *.php
do
    ./$i
done

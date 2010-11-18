#!/bin/bash

cd `dirname $0`
cd ..

/usr/local/bin/docco src/*.js src/effects/*.js

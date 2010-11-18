#!/bin/bash

cd `dirname $0`

cp ../src/settings.js ../build/
cp ../src/story.js ../build/

java -jar yuicompressor-2.4.2.jar ../src/cacophony.css -o ../build/cacophony.min.css --charset utf-8 -v

cat ../src/lib/cake.min.js \
	../src/cacophony.js \
	../src/lib/contextfree.min.js \
	../src/lib/harmony/brushes/ribbon.js \
	../src/lib/harmony/harmony.js \
	../src/lib/three.min.js \
	../src/lib/geometry/primitives/plane.js \
	../src/lib/geometry/primitives/cube.js \
	../src/lib/geometry/primitives/sphere.js \
	../src/effects/core.js \
	../src/effects/context.js \
	../src/effects/ribbon.js \
	../src/effects/lyrics.js \
	../src/effects/input.js \
	../src/effects/datafeed.js \
	../src/effects/flicker.js \
	../src/effects/volume.js \
	../src/effects/skyline.js \
	../src/effects/circles.js \
	../src/effects/three.js \
	../src/effects/cube.js > ../build/cacophony.js

java -jar yuicompressor-2.4.2.jar ../build/cacophony.js -o ../build/cacophony.min.js --charset utf-8 -v
rm ../build/cacophony.js

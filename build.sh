#!/usr/bin/env bash

# merge to one es2015 file
rollup --input src.es2015/stairways.js --output dist/stairways.es2015.js
# transpile the file to es5 and create node version
#babel dist/stairways.es2015.js --out-file dist/stairways.es5.node.js --source-maps inline
babel dist/stairways.es2015.js --out-file dist/stairways.es5.node.js --source-maps

# browser version
browserify dist/stairways.es2015.js -t babelify --outfile dist/stairways.es5.browser.js --standalone stairways --source-maps

# copy map
cp dist/stairways.es5.node.js.map dist/stairways.es5.browser.js.map

# copy for samples
cp dist/stairways.es2015.js samples.es2015/libs/stairways.es2015.js

cp dist/stairways.es2015.js samples.es5/libs/stairways.es2015.js
cp dist/stairways.es5.node.js samples.es5/libs/stairways.es5.node.js
cp dist/stairways.es5.node.js.map samples.es5/libs/stairways.es5.node.js.map
cp dist/stairways.es5.browser.js samples.es5/libs/stairways.es5.browser.js
cp dist/stairways.es5.browser.js.map samples.es5/libs/stairways.es5.browser.js.map



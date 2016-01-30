#!/usr/bin/env bash

rollup --input src.es2015/stairways.js --output dist/stairways.es6.js
cp dist/stairways.es6.js samples.es2015/lib/stairways.es6.js
babel dist/stairways.es6.js --out-file dist/stairways.es5.node.js --source-maps inline
browserify dist/stairways.es6.js -t babelify --outfile dist/stairways.es5.browser.js --standalone stairways
cp dist/stairways.es5.node.js samples.es5/lib/stairways.es5.node.js
cp dist/stairways.es5.browser.js samples.es5/lib/stairways.es5.browser.js




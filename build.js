import fs from 'fs';
import rollup from 'rollup';
import babel from 'rollup-plugin-babel';

/**
 *
 * @param options
 * @returns {Promise}
 */
let copyFiles = (options) => {
  return new Promise((resolve, reject) => {
    try {
      if(options.message) { console.log(options.message); }
      fs.createReadStream(options.from)
          .pipe(fs.createWriteStream(options.to));

      if(options.copyMaps==true) {
        fs.createReadStream(options.from+".map")
            .pipe(fs.createWriteStream(options.to+".map"));
      }

      resolve(true);
    } catch(err) {
      reject(err);
    }
  });
};




/**
 * Generate the ES2015 bundle (this is a merge of the ./src directory
 * @param options
 * @returns {Promise}
 */
let generateES2015Bundle = (options) => {

  return new Promise((resolve, reject) => {
    try {
      rollup.rollup({
        entry: options.entry
      }).then((bundle) => {
        if(options.message) console.log(options.message);
        let res = bundle.write({
          dest: options.dest
        });
        resolve(res); // res is a promise (see: https://github.com/rollup/rollup/wiki/JavaScript-API)
      })
    } catch(e) {
      reject(err);
    }
  });

};

/**
 *
 * @param options
 * @returns {Promise}
 */
let generateES5NodeBundle = (options) => {
  return new Promise((resolve, reject) => {
    try {

      rollup.rollup({
        entry: options.entry,
        plugins: [
          babel({
            exclude: 'node_modules/**'
          })
        ]
      }).then((bundle) => {
        if(options.message) console.log(options.message);
        let res = bundle.write({
          dest: options.dest,
          format:'cjs',
          sourceMap: true
        });
        resolve(res); // res is a promise
      });

    } catch(err) {
      reject(err);
    }
  });
};

/**
 *
 * @param options
 * @returns {Promise}
 */
let generateES5BrowserBundle = (options) => {
  return new Promise((resolve, reject) => {
    try {

      rollup.rollup({
        entry: options.entry,
        plugins: [
          babel({
            exclude: 'node_modules/**'
          })
        ]
      }).then((bundle) => {
        if(options.message) console.log(options.message);
        let res = bundle.write({
          dest: options.dest,
          format:'iife',
          moduleName: options.moduleName,
          sourceMap: true
        });
        resolve(res); // res is a promise
      });

    } catch(err) {
      reject(err);
    }
  });
};

/**
 * Build versions of stairways
 */
generateES2015Bundle({
  entry: './src/stairways.js',
  dest: './distribution/stairways.es2015.js',
  message: '1- create es2015 bundle for distribution'
}).then(()=> {

  return generateES5NodeBundle({
    entry: './distribution/stairways.es2015.js',
    dest: './distribution/stairways.es5.node.js',
    message: '2-[transpile to ES5] create es5 node bundle for distribution'
  });

}).then(() => {

  return generateES5BrowserBundle({
    entry: './distribution/stairways.es2015.js',
    dest: './distribution/stairways.es5.browser.js',
    moduleName: 'stairways',
    message:'3-[transpile to ES5] create es5 browser bundle for distribution'
  });

}).then(() => {
  copyFiles({
    message: "1- copy es2015 (node) bundle to samples",
    from: process.cwd() +'/distribution/stairways.es2015.js',
    to: process.cwd() + '/samples/es2015.node/stairways.es2015.js',
    copyMaps: false
  }).then(() => {

    return copyFiles({
      message: "2- copy es5 node bundle to samples",
      from: process.cwd() + '/distribution/stairways.es5.node.js',
      to: process.cwd() + '/samples/es5.node/stairways.es5.node.js',
      copyMaps: true
    })

  }).then(() => {

    return copyFiles({
      message: "3- copy es5 browser bundle to samples",
      from: process.cwd() + '/distribution/stairways.es5.browser.js',
      to: process.cwd() + '/samples/es5.browser/stairways.es5.browser.js',
      copyMaps: true
    })

  });

});

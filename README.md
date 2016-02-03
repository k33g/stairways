# StairWays

Some functional helpers for JavaScript (ES5 and ES2015) / **W.I.P.**

## Purpose

The absence of data is often the result of errors that you should probably handle by throwing an exception. 

Some functional types allows to easily handling errors and exceptions.

**StairWays** provides 2 new Types:

- `Optional` like the `Optional` of Java 8 [https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html)
- `Result` like the `Result` of Golo [http://golo-lang.org/documentation/next/javadoc/gololang/error/Result.html](http://golo-lang.org/documentation/next/javadoc/gololang/error/Result.html)


## CookBook

*WIP*

### Play with Optional

```javascript
import {Optional} from '/dist/stairways.es6';

Optional.ofNullable(42).filter((value) => {
  return value == 42
}).map((value) => {
  console.log("-> ", value) // -> 42
  return 69
}).flatMap((value) => {
  console.log("-> ", value) // -> 69
  return Optional.of("YES!")
}).toString() // Optional[YES!]
```

### Divide and Either

```javascript
import {Result} from '/dist/stairways.es6';

let divide = (a, b) => {
  try {
    var result = a/b;
    if (isNaN(result)) throw new Error("Not a number");
    if (!isFinite(result)) throw new Error("divide by 0"); // with JavaScript n/0 = Infinity
    return Result.ok(result);
  } catch (e) {
    return Result.error(e);
  }
};

divide(4, 5).either((value) => {
  console.log(`the result is ${value}`);
}, (error) => {
  console.log(error);
});
// the result is 0.8

divide(4, 0).either((value) => {
  console.log(`the result is ${value}`);
}, (error) => {
  console.log(error);
});
//[Error: divide by 0]


divide("A", "B").either((value) => {
  console.log(`the result is ${value}`);
}, (error) => {
  console.log(error);
});
//[Error: Not a number]
```

## API

*WIP*

## "Run/Install" it

### ES2015 mode

First you need babel:

    npm install babel-cli
    npm install babel-preset-es2015
    
Then add a `.babelrc` file at the root of the project:

    {
      "presets": ["es2015"]
    }
    

#### with babel-node

Create a `app.js` file:

```javascript
import {Optional, Result} from './dist/stairways.es6';
    
console.log(Optional.ofNullable(42).orElseGet((val) => {
  return 69;
}));
 
Result.error(Error("Huston?")).either((val) => {
  console.log("Either OK", val)
},(err) => {
  console.log("Either KO", err)
});
```

You can run it like that: `babel-node app.js`

#### with node

If you prefer run `app.js` with node, you have to write a little "hook",ie create a `hook.js` file:

```javascript
#!/usr/bin/env node

require("babel-register")({
  presets: [
    "es2015"
  ] });
var app = require('./app');
```

Now, you can run it like that: `node hook.js`

#### with browser

    // WIP


### ES5

#### with node

You just need to declare `stairways.es5.node`

```javascript
var stairways = require("./lib/stairways.es5.node");
var Result = stairways.Result;


Result.ok(5).either(function(val) {
  console.log("Either OK", val)
}, function(err) {
  console.log("Either KO", err)
});
```

#### with browser

You just need to declare `stairways.es5.browser`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="lib/stairways.es5.browser.js"></script>
</head>
<body>

<script>
  var Result = stairways.Result;

  Result.ok(5).either(function(val) {
    console.log("Either OK", val)
  }, function(err) {
    console.log("Either KO", err)
  });

</script>
</body>
</html>
```

## Build

### Dependencies

You must install first dependencies:

    sudo npm install babel-cli -g
    sudo npm install -g rollup
    sudo npm install -g browserify

    npm install

### Building stairways.js

    ./build.sh
    
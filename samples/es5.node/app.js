/**
 * Created by k33g_org on 30/01/16.
 */


var stairways = require("./stairways.es5.node");
var Result = stairways.Result;
var Optional = stairways.Optional;

Result.ok(5).either(function(val) {
  console.log("Either OK", val)
}, function(err) {
  console.log("Either KO", err)
});

Result.error(Error("Huston?")).either(function(val) {
  console.log("Either OK", val)
},function(err) {
  console.log("Either KO", err)
});

console.log(Optional.ofNullable(null).orElseGet(function(val) {
  return 69;
}));

console.log(Optional.ofNullable(42).orElseGet(function(val) {
  return 69;
}));

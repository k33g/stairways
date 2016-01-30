/**
 * Created by k33g_org on 30/01/16.
 */
var stairways = require("./lib/stairways.es5.node");
var Result = stairways.Result;


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
/**
 * Created by k33g_org on 29/01/16.
 *
 * babel-preset-es2015
 * babel-cli ?
 */

import {Optional, Objects,Result, Identity } from '../src/stairways';

//rollup --input es6/stairways.js --output stairways.js


let opt = Optional.of(5)

let opt1 = Optional.ofNullable();
let opt2 = Optional.ofNullable(null);
let opt3 = Optional.ofNullable(42);
//console.log(opt3)

console.log("opt.isPresent", opt.isPresent())

console.log(opt1, opt2, opt3)

console.log(opt3.get())
console.log(opt.get())
//console.log(opt2.get())

opt3.isPresent((val) => {
  console.log("accepted", val)
});


console.log(opt2, "-->", opt2.isPresent())
console.log(opt1, "-->", opt1.isPresent())


opt2.isPresent((val) => {
  console.log("accepted", val)
});


console.log("filter1", opt3.filter((val) => {
  return val < 5
}))

console.log("filter2", opt3.filter((val) => {
  return val == 42
}))

console.log(Objects.requireNonNull(5,"boum"))

console.log("Mapper", opt3.map((val)=>{
  return val+=10;
}));

console.log("FlatMapper", opt3.flatMap((val)=>{
  return Optional.of(val+100);
}));

/*
console.log("FlatMapper", opt3.flatMap((val)=>{
  return val+2;
}));
*/


console.log(opt1, opt1.orElse(42))
console.log(opt2, opt2.orElse(42))
console.log(opt3, opt3.orElse(1000))

opt3.orElseGet((val) => {
  console.log("1", val)
  return 23
});

opt2.orElseGet((val) => {
  console.log("2", val)
  return 23
});

//opt1.orElseGet(0);

console.log(opt2.equals(opt2))
console.log(opt3.equals(opt2))
console.log(opt3.equals(42))
console.log(opt3.equals(Optional.of(42)))


console.log(opt3.toString())
console.log(opt2.toString())
console.log(opt1.toString())

console.log(Optional.ofNullable(null).orElseGet((val) => {
  return 69;
}));

console.log(Optional.ofNullable(42).orElseGet((val) => {
  return 69;
}));

let res = Result.ok(5)

res.either((val) => {
  console.log("Either OK", val)
},(err) => {
  console.log("Either KO", err)
});

let res1 = Result.error(Error("Huston?"))

res1.either((val) => {
  console.log("Either OK", val)
},(err) => {
  console.log("Either KO", err)
});

let compute = (a,b) => Identity.of(100)
    .map(value => value + a)
    .map(value => value * b)
    .get();

console.log("Compute with Identity", compute(10, 2));

#!/usr/bin/env node

require("babel-register")({
  presets: [
    "es2015"
  ] });
var app = require('./app');

"use strict";

var istanbul = require('istanbul');

for (var key in istanbul) {
  if (istanbul.hasOwnProperty(key)) {
    exports[key] = istanbul[key];
  }
}

exports.Instrumenter = require("./instrumenter").Instrumenter;
exports.version = require("../package.json").version;
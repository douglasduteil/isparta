"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var istanbul = _interopRequireWildcard(require("istanbul"));

for (var key in istanbul) {
	if (istanbul.hasOwnProperty(key)) {
		exports[key] = istanbul[key];
	}
}

exports.Instrumenter = require("./instrumenter").Instrumenter;
exports.version = require("../package.json").version;
Object.defineProperty(exports, "__esModule", {
	value: true
});
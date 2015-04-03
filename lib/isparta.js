'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _import = require('istanbul');

var istanbul = _interopRequireWildcard(_import);

for (var key in istanbul) {
	if (istanbul.hasOwnProperty(key)) {
		exports[key] = istanbul[key];
	}
}

var _Instrumenter = require('./instrumenter');

Object.defineProperty(exports, 'Instrumenter', {
	enumerable: true,
	get: function get() {
		return _Instrumenter.Instrumenter;
	}
});

var _version = require('../package.json');

Object.defineProperty(exports, 'version', {
	enumerable: true,
	get: function get() {
		return _version.version;
	}
});
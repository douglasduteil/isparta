"use strict";

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

require('6to5/polyfill');

var istanbul = require('istanbul');

var to5 = require('6to5');

var esprima = require('esprima');

var escodegen = require('escodegen');

var SourceMapConsumer = require('source-map').SourceMapConsumer;
var SourceMapGenerator = require('source-map').SourceMapGenerator;
var Instrumenter = (function (istanbul) {
  var Instrumenter = function Instrumenter(options) {
    if (options === undefined) options = {};
    this.to5Options = Object.assign({
      module: "ignore",
      sourceMap: true
    }, options && options.to5 && options.to5.options || {});
    istanbul.Instrumenter.call(this, options);
  };

  _extends(Instrumenter, istanbul.Instrumenter);

  Instrumenter.prototype.instrumentSync = function (code, fileName) {
    var result = this._r = to5.transform(code, Object.assign({}, this.to5Options, { filename: fileName }));
    this._6to5Map = new SourceMapConsumer(result.map);

    // PARSE
    var program = esprima.parse(result.code, {
      loc: true,
      range: true,
      tokens: this.opts.preserveComments,
      comment: true
    });

    if (this.opts.preserveComments) {
      program = escodegen.attachComments(program, program.comments, program.tokens);
    }

    return this.instrumentASTSync(program, fileName, code);
  };

  Instrumenter.prototype.getPreamble = function (sourceCode, emitUseStrict) {
    var _this = this;
    var statementMap = this.coverState.statementMap;
    var fnMap = this.coverState.fnMap;
    var branchMap = this.coverState.branchMap;


    Object.keys(statementMap).map(function (key) {
      return statementMap[key] || [];
    }).forEach(function (loc) {
      _this._fixLocation(loc);
    });

    Object.keys(fnMap).map(function (key) {
      return fnMap[key] || [];
    }).forEach(function (fn) {
      fn.line = _this._fixLocation(fn.loc);
    });

    Object.keys(branchMap).map(function (key) {
      return branchMap[key] || [];
    }).forEach(function (br) {
      var brLine = br.line;
      br.locations.map(function (loc) {
        brLine = _this._fixLocation(loc);
      });
      br.line = brLine;
    });

    return istanbul.Instrumenter.prototype.getPreamble.call(this, sourceCode, emitUseStrict);
  };

  Instrumenter.prototype._skipLocation = function (location) {
    location.start = { line: 1, column: 0 };
    location.end = { line: 1, column: 0 };
    location.skip = true;

    return location;
  };

  Instrumenter.prototype._fixLocation = function (loc) {
    var _this2 = this;
    var lastLine = 1;

    ["start", "end"].forEach(function (k) {
      loc[k] = _this2._6to5Map.originalPositionFor(loc[k]);
      if (loc[k].source == null) {
        _this2._skipLocation(loc);
        return false;
      }
      lastLine = loc[k].line;
    });

    return lastLine;
  };

  return Instrumenter;
})(istanbul);

exports.Instrumenter = Instrumenter;
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var istanbul = _interopRequire(require("istanbul"));

var babel = _interopRequire(require("babel-core"));

var esprima = _interopRequire(require("esprima"));

var escodegen = _interopRequire(require("escodegen"));

var _sourceMap = require("source-map");

var SourceMapConsumer = _sourceMap.SourceMapConsumer;
var SourceMapGenerator = _sourceMap.SourceMapGenerator;
var Instrumenter = exports.Instrumenter = (function (_istanbul$Instrumenter) {
  function Instrumenter() {
    var options = arguments[0] === undefined ? {} : arguments[0];
    _classCallCheck(this, Instrumenter);

    this.babelOptions = _extends({
      sourceMap: true }, options && options.babel || {});

    istanbul.Instrumenter.call(this, options);
  }

  _inherits(Instrumenter, _istanbul$Instrumenter);

  _prototypeProperties(Instrumenter, null, {
    instrumentSync: {
      value: function instrumentSync(code, fileName) {
        var result = this._r = babel.transform(code, _extends({}, this.babelOptions, { filename: fileName }));
        this._babelMap = new SourceMapConsumer(result.map);

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
      },
      writable: true,
      configurable: true
    },
    getPreamble: {
      value: function getPreamble(sourceCode, emitUseStrict) {
        var _this = this;
        var _coverState = this.coverState;
        var statementMap = _coverState.statementMap;
        var fnMap = _coverState.fnMap;
        var branchMap = _coverState.branchMap;


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

        return _get(Object.getPrototypeOf(Instrumenter.prototype), "getPreamble", this).call(this, sourceCode, emitUseStrict);
      },
      writable: true,
      configurable: true
    },
    _skipLocation: {
      value: function _skipLocation(location) {
        location.start = { line: 1, column: 0 };
        location.end = { line: 1, column: 0 };
        location.skip = true;

        return location;
      },
      writable: true,
      configurable: true
    },
    _fixLocation: {
      value: function _fixLocation(loc) {
        var _this = this;
        var lastLine = 1;

        ["start", "end"].forEach(function (k) {
          loc[k] = _this._babelMap.originalPositionFor(loc[k]);
          if (loc[k].source == null) {
            _this._skipLocation(loc);
            return false;
          }
          delete loc[k].source;
          delete loc[k].name;
          lastLine = loc[k].line;
        });

        return lastLine;
      },
      writable: true,
      configurable: true
    }
  });

  return Instrumenter;
})(istanbul.Instrumenter);
Object.defineProperty(exports, "__esModule", {
  value: true
});
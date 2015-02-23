"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

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


var POSITIONS = ["start", "end"];

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


        [["s", "statementMap"], ["f", "fnMap"], ["b", "branchMap"]].forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2);

          var metricName = _ref2[0];
          var metricMapName = _ref2[1];
          var _ref3 = [_this.coverState[metricName], _this.coverState[metricMapName]];

          var metrics = _ref3[0];
          var metricMap = _ref3[1];
          var transformFctName = "_" + metricMapName + "Transformer";
          var transformedMetricMap = _this[transformFctName](metricMap, metrics);
          _this.coverState[metricMapName] = transformedMetricMap;
        });

        return _get(Object.getPrototypeOf(Instrumenter.prototype), "getPreamble", this).call(this, sourceCode, emitUseStrict);
      },
      writable: true,
      configurable: true
    },
    _statementMapTransformer: {

      ////

      value: function _statementMapTransformer(metrics) {
        var _this = this;
        return Object.keys(metrics).map(function (index) {
          return metrics[index];
        }).map(function (statementMeta) {
          var _getMetricOriginalLocations = _this._getMetricOriginalLocations([statementMeta]);

          var _getMetricOriginalLocations2 = _slicedToArray(_getMetricOriginalLocations, 1);

          var location = _getMetricOriginalLocations2[0];
          return location;
        }).reduce(this._arrayToArrayLikeObject, {});
      },
      writable: true,
      configurable: true
    },
    _fnMapTransformer: {
      value: function _fnMapTransformer(metrics) {
        var _this = this;
        return Object.keys(metrics).map(function (index) {
          return metrics[index];
        }).map(function (fnMeta) {
          var _getMetricOriginalLocations = _this._getMetricOriginalLocations([fnMeta.loc]);

          var _getMetricOriginalLocations2 = _slicedToArray(_getMetricOriginalLocations, 1);

          var _getMetricOriginalLocations2$0 = _getMetricOriginalLocations2[0];
          var start = _getMetricOriginalLocations2$0.start;
          var end = _getMetricOriginalLocations2$0.end;
          var skip = _getMetricOriginalLocations2$0.skip;


          // Force remove the last skip key
          delete fnMeta.skip;
          skip = skip ? { skip: skip } : {};

          return _extends({}, fnMeta, _extends({ loc: { start: start, end: end } }, skip));
        }).reduce(this._arrayToArrayLikeObject, {});;
      },
      writable: true,
      configurable: true
    },
    _branchMapTransformer: {
      value: function _branchMapTransformer(metrics) {
        var _this = this;
        return Object.keys(metrics).map(function (index) {
          return metrics[index];
        }).map(function (branchMeta) {
          return _extends({}, branchMeta, {
            locations: _this._getMetricOriginalLocations(branchMeta.locations)
          });
        }).reduce(this._arrayToArrayLikeObject, {});;
      },
      writable: true,
      configurable: true
    },
    _getMetricOriginalLocations: {

      ////

      value: function _getMetricOriginalLocations() {
        var _this = this;
        var metricLocations = arguments[0] === undefined ? [] : arguments[0];
        var o = { line: 0, column: 0 };
        return metricLocations.map(function (generatedPositions) {
          return [_this._getOriginalPositionsFor(generatedPositions), generatedPositions];
        }).map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2);

          var _ref2$0 = _ref2[0];
          var start = _ref2$0.start;
          var end = _ref2$0.end;
          var _ref2$1 = _ref2[1];
          var generatedStart = _ref2$1.start;
          var generatedEnd = _ref2$1.end;
          var postitions = [start.line, start.column, end.line, end.column];
          var isValid = postitions.reduce(function (bool, n) {
            bool &= n !== null;return bool;
          }, 1);

          return isValid ? { start: start, end: end } : { start: o, end: o, skip: true };
        });
      },
      writable: true,
      configurable: true
    },
    _getOriginalPositionsFor: {
      value: function _getOriginalPositionsFor() {
        var _this = this;
        var generatedPositions = arguments[0] === undefined ? { start: {}, end: {} } : arguments[0];
        return POSITIONS.map(function (position) {
          return [generatedPositions[position], position];
        }).reduce(function (originalPositions, _ref) {
          var _ref2 = _slicedToArray(_ref, 2);

          var generatedPosition = _ref2[0];
          var position = _ref2[1];
          var originalPosition = _this._babelMap.originalPositionFor(generatedPosition);
          // remove extra keys
          delete originalPosition.name;
          delete originalPosition.source;
          originalPositions[position] = originalPosition;
          return originalPositions;
        }, {});
      },
      writable: true,
      configurable: true
    },
    _arrayToArrayLikeObject: {
      value: function _arrayToArrayLikeObject(arrayLikeObject, item, index) {
        arrayLikeObject[index + 1] = item;
        return arrayLikeObject;
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
'use strict';

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (descriptor.value) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _istanbul = require('istanbul');

var istanbul = _interopRequire(_istanbul);

var _babelTransform = require('babel-core');

var _esprima = require('esprima');

var esprima = _interopRequire(_esprima);

var _escodegen = require('escodegen');

var escodegen = _interopRequire(_escodegen);

var _SourceMapConsumer$SourceMapGenerator = require('source-map');

var POSITIONS = ['start', 'end'];

var Instrumenter = (function (_istanbul$Instrumenter) {
  function Instrumenter() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Instrumenter);

    _get(Object.getPrototypeOf(Instrumenter.prototype), 'constructor', this).call(this);

    istanbul.Instrumenter.call(this, options);

    this.babelOptions = _extends({
      sourceMap: true }, options && options.babel || {});
  }

  _inherits(Instrumenter, _istanbul$Instrumenter);

  _createClass(Instrumenter, [{
    key: 'instrumentSync',
    value: function instrumentSync(code, fileName) {

      var result = this._r = _babelTransform.transform(code, _extends({}, this.babelOptions, { filename: fileName }));
      this._babelMap = new _SourceMapConsumer$SourceMapGenerator.SourceMapConsumer(result.map);

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
    }
  }, {
    key: 'getPreamble',
    value: function getPreamble(sourceCode, emitUseStrict) {
      var _this = this;

      [['s', 'statementMap'], ['f', 'fnMap'], ['b', 'branchMap']].forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var metricName = _ref2[0];
        var metricMapName = _ref2[1];
        var metrics = _this.coverState[metricName];
        var metricMap = _this.coverState[metricMapName];

        var transformFctName = '_' + metricMapName + 'Transformer';
        var transformedMetricMap = _this[transformFctName](metricMap, metrics);
        _this.coverState[metricMapName] = transformedMetricMap;
      });

      return _get(Object.getPrototypeOf(Instrumenter.prototype), 'getPreamble', this).call(this, sourceCode, emitUseStrict);
    }
  }, {
    key: '_statementMapTransformer',

    ////

    value: function _statementMapTransformer(metrics) {
      var _this2 = this;

      return Object.keys(metrics).map(function (index) {
        return metrics[index];
      }).map(function (statementMeta) {
        var _getMetricOriginalLocations = _this2._getMetricOriginalLocations([statementMeta]);

        var _getMetricOriginalLocations2 = _slicedToArray(_getMetricOriginalLocations, 1);

        var location = _getMetricOriginalLocations2[0];

        return location;
      }).reduce(this._arrayToArrayLikeObject, {});
    }
  }, {
    key: '_fnMapTransformer',
    value: function _fnMapTransformer(metrics) {
      var _this3 = this;

      return Object.keys(metrics).map(function (index) {
        return metrics[index];
      }).map(function (fnMeta) {
        var _getMetricOriginalLocations3 = _this3._getMetricOriginalLocations([fnMeta.loc]);

        var _getMetricOriginalLocations32 = _slicedToArray(_getMetricOriginalLocations3, 1);

        var _getMetricOriginalLocations32$0 = _getMetricOriginalLocations32[0];
        var start = _getMetricOriginalLocations32$0.start;
        var end = _getMetricOriginalLocations32$0.end;
        var skip = _getMetricOriginalLocations32$0.skip;

        // Force remove the last skip key
        delete fnMeta.skip;
        skip = skip ? { skip: skip } : {};

        return _extends({}, fnMeta, _extends({ loc: { start: start, end: end } }, skip));
      }).reduce(this._arrayToArrayLikeObject, {});;
    }
  }, {
    key: '_branchMapTransformer',
    value: function _branchMapTransformer(metrics) {
      var _this4 = this;

      return Object.keys(metrics).map(function (index) {
        return metrics[index];
      }).map(function (branchMeta) {
        return _extends({}, branchMeta, {
          locations: _this4._getMetricOriginalLocations(branchMeta.locations)
        });
      }).reduce(this._arrayToArrayLikeObject, {});;
    }
  }, {
    key: '_getMetricOriginalLocations',

    ////

    value: function _getMetricOriginalLocations() {
      var _this5 = this;

      var metricLocations = arguments[0] === undefined ? [] : arguments[0];
      var o = { line: 0, column: 0 };
      return metricLocations.map(function (generatedPositions) {
        return [_this5._getOriginalPositionsFor(generatedPositions), generatedPositions];
      }).map(function (_ref3) {
        var _ref32 = _slicedToArray(_ref3, 2);

        var _ref32$0 = _ref32[0];
        var start = _ref32$0.start;
        var end = _ref32$0.end;
        var _ref32$1 = _ref32[1];
        var generatedStart = _ref32$1.start;
        var generatedEnd = _ref32$1.end;

        var postitions = [start.line, start.column, end.line, end.column];
        var isValid = postitions.reduce(function (bool, n) {
          bool &= n !== null;return bool;
        }, 1);

        return isValid ? { start: start, end: end } : { start: o, end: o, skip: true };
      });
    }
  }, {
    key: '_getOriginalPositionsFor',
    value: function _getOriginalPositionsFor() {
      var _this6 = this;

      var generatedPositions = arguments[0] === undefined ? { start: {}, end: {} } : arguments[0];

      return POSITIONS.map(function (position) {
        return [generatedPositions[position], position];
      }).reduce(function (originalPositions, _ref4) {
        var _ref42 = _slicedToArray(_ref4, 2);

        var generatedPosition = _ref42[0];
        var position = _ref42[1];

        var originalPosition = _this6._babelMap.originalPositionFor(generatedPosition);
        // remove extra keys
        delete originalPosition.name;
        delete originalPosition.source;
        originalPositions[position] = originalPosition;
        return originalPositions;
      }, {});
    }
  }, {
    key: '_arrayToArrayLikeObject',
    value: function _arrayToArrayLikeObject(arrayLikeObject, item, index) {
      arrayLikeObject[index + 1] = item;
      return arrayLikeObject;
    }
  }]);

  return Instrumenter;
})(istanbul.Instrumenter);

exports.Instrumenter = Instrumenter;
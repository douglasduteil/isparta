"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _get = function get(object, property, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === undefined) {
      return undefined;
    }
    return getter.call(receiver);
  }
};

var _inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

var _interopRequireWildcard = function (obj) {
  return obj && obj.constructor === Object ? obj : {
    "default": obj
  };
};

require("6to5/polyfill");

var istanbul = _interopRequireWildcard(require("istanbul"));

var to5 = _interopRequireWildcard(require("6to5"));

var esprima = _interopRequireWildcard(require("esprima"));

var escodegen = _interopRequireWildcard(require("escodegen"));

var SourceMapConsumer = require("source-map").SourceMapConsumer;
var SourceMapGenerator = require("source-map").SourceMapGenerator;
var Instrumenter = (function (_istanbul$Instrumenter) {
  function Instrumenter() {
    var options = arguments[0] === undefined ? {} : arguments[0];
    this.to5Options = Object.assign({
      module: "ignore",
      sourceMap: true
    }, options && options.to5 && options.to5.options || {});

    istanbul.Instrumenter.call(this, options);
  }

  _inherits(Instrumenter, _istanbul$Instrumenter);

  _prototypeProperties(Instrumenter, null, {
    instrumentSync: {
      value: function (code, fileName) {
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
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    getPreamble: {
      value: function (sourceCode, emitUseStrict) {
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

        return _get(Object.getPrototypeOf(Instrumenter.prototype), "getPreamble", this).call(this, sourceCode, emitUseStrict);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _skipLocation: {
      value: function (location) {
        location.start = { line: 1, column: 0 };
        location.end = { line: 1, column: 0 };
        location.skip = true;

        return location;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _fixLocation: {
      value: function (loc) {
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
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Instrumenter;
})(istanbul.Instrumenter);

exports.Instrumenter = Instrumenter;
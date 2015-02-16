
import istanbul from 'istanbul';
import babel from 'babel-core';

import esprima from 'esprima';
import escodegen from 'escodegen';

import {SourceMapConsumer, SourceMapGenerator} from 'source-map';

export class Instrumenter extends istanbul.Instrumenter {

  constructor(options = {}) {
    this.babelOptions = {
      sourceMap: true,
      ...(options && options.babel || {})
    };

    istanbul.Instrumenter.call(this, options);

  }

  instrumentSync(code, fileName) {

    let result = this._r = babel.transform(code, { ...this.babelOptions, filename: fileName });
    this._babelMap = new SourceMapConsumer(result.map);

    // PARSE
    let program = esprima.parse(result.code, {
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

  getPreamble(sourceCode, emitUseStrict) {
    let {statementMap, fnMap, branchMap} =  this.coverState;

    Object
      .keys(statementMap)
      .map(key => statementMap[key] || [])
      .forEach((loc) => {
        this._fixLocation(loc);
      });

    Object
      .keys(fnMap)
      .map(key => fnMap[key] || [])
      .forEach((fn) => {
        fn.line = this._fixLocation(fn.loc);
      });

    Object
      .keys(branchMap)
      .map(key => branchMap[key] || [])
      .forEach((br) => {
        let brLine = br.line;
        br.locations
          .map((loc) => {
            brLine = this._fixLocation(loc);
          });
        br.line = brLine;
      });

    return super.getPreamble(sourceCode, emitUseStrict);
  }

  _skipLocation(location) {
    location.start = { line: 1, column: 0 };
    location.end = { line: 1, column: 0 };
    location.skip = true;

    return location;
  }

  _fixLocation(loc) {
    var lastLine = 1;

    ['start', 'end'].forEach((k) => {
      loc[k] = this._babelMap.originalPositionFor(loc[k]);
      if (loc[k].source == null){
        this._skipLocation(loc);
        return false;
      }
      delete loc[k].source;
      delete loc[k].name;
      lastLine = loc[k].line;
    });

    return lastLine;
  }
}


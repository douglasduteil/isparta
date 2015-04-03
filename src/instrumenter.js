
import istanbul from 'istanbul';
import {transform as babelTransform} from 'babel-core';

import esprima from 'esprima';
import escodegen from 'escodegen';

import {SourceMapConsumer, SourceMapGenerator} from 'source-map';

const POSITIONS = ['start', 'end'];

export class Instrumenter extends istanbul.Instrumenter {

  constructor(options = {}) {
    super();

    istanbul.Instrumenter.call(this, options);

    this.babelOptions = {
      sourceMap: true,
      ...(options && options.babel || {})
    };
  }

  instrumentSync(code, fileName) {

    let result = this._r =
      babelTransform(code, { ...this.babelOptions, filename: fileName });
    this._babelMap = new SourceMapConsumer(result.map);

    // PARSE
    let program = esprima.parse(result.code, {
      loc: true,
      range: true,
      tokens: this.opts.preserveComments,
      comment: true
    });

    if (this.opts.preserveComments) {
      program = escodegen
        .attachComments(program, program.comments, program.tokens);
    }

    return this.instrumentASTSync(program, fileName, code);
  }

  getPreamble(sourceCode, emitUseStrict) {

     [['s','statementMap'], ['f', 'fnMap'], ['b', 'branchMap']]
    .forEach(([metricName, metricMapName]) => {
      let [metrics, metricMap] = [
        this.coverState[metricName],
        this.coverState[metricMapName]
      ];
      let transformFctName = `_${metricMapName}Transformer`;
      let transformedMetricMap = this[transformFctName](metricMap, metrics)
      this.coverState[metricMapName] = transformedMetricMap;
    })

    return super.getPreamble(sourceCode, emitUseStrict);
  }

  ////

   _statementMapTransformer(metrics){
    return Object.keys(metrics)
      .map((index) => metrics[index])
      .map((statementMeta) => {
        let [location] = this._getMetricOriginalLocations([statementMeta]);
        return location;
      })
      .reduce(this._arrayToArrayLikeObject, {});
  }

  _fnMapTransformer(metrics){
    return Object.keys(metrics)
      .map((index) => metrics[index])
      .map((fnMeta) => {
        let [{start, end, skip}] =
          this._getMetricOriginalLocations([fnMeta.loc]);

        // Force remove the last skip key
        delete fnMeta.skip;
        skip = skip ? {skip: skip} : {};

        return {...fnMeta, ...{loc: {start, end}, ...skip}};
      })
      .reduce(this._arrayToArrayLikeObject, {});;
  }

  _branchMapTransformer(metrics){
    return Object.keys(metrics)
      .map((index) => metrics[index])
      .map((branchMeta) => {
        return {
          ...branchMeta,
          ...{
            locations: this._getMetricOriginalLocations(branchMeta.locations)
          }
        };
      })
      .reduce(this._arrayToArrayLikeObject, {});;
  }

  ////

  _getMetricOriginalLocations(metricLocations = []){ let o = { line: 0, column: 0};
    return metricLocations
      .map((generatedPositions) => {
        return [
          this._getOriginalPositionsFor(generatedPositions),
          generatedPositions
        ]
      })
      .map(([{start, end}, {start: generatedStart, end: generatedEnd}]) => {
        let postitions = [start.line, start.column, end.line, end.column];
        let isValid = postitions.reduce((bool, n) => {
          bool &= n !== null; return bool;
        }, 1);

        return isValid
          ? { start, end }
          : { start: o, end: o, skip: true };
      })
  }

  _getOriginalPositionsFor(generatedPositions = { start : {}, end : {} }){
    return POSITIONS
      .map((position) => [generatedPositions[position], position])
      .reduce((originalPositions, [generatedPosition, position]) => {
        let originalPosition = this._babelMap.originalPositionFor(generatedPosition);
        // remove extra keys
        delete originalPosition.name;
        delete originalPosition.source;
        originalPositions[position] = originalPosition;
        return originalPositions;
      }, {});
  }

  _arrayToArrayLikeObject(arrayLikeObject, item, index) {
    arrayLikeObject[index + 1] = item;
    return arrayLikeObject;
  };

}


//
//

import {expect} from 'chai';
import {Instrumenter, Reporter} from '../src/isparta';

const content = `
ONE.foo = function (bar) {
  return baz(bar ? 0 : 1);
};
`;

const contentLines = content.split('\n');

// ES6 code
// 1. ONE.foo = function (bar) {
// 2.   return baz(bar ? 0 : 1);
// 3. };
// Generated code by 6to5
// 1. "use strict";
// 2.
// 3. ONE.foo = function (bar) {
// 4.   return baz(bar ? 0 : 1);
// 5. };

const expectedCoverState = {
  statementMap: [
    {
      start: {source: 'foo.js', line: 2, column: 0, name: null},
      end: {source: 'foo.js', line: 4, column: 2, name: null},
      skip: undefined
    },
    {
      start: {source: 'foo.js', line: 3, column: 2, name: null},
      end: {source: 'foo.js', line: 3, column: 26, name: null},
      skip: undefined
    }
  ],

  fnMap: [
    {
      name: '(anonymous_1)', line: 2,
      loc: {
        start: {source: 'foo.js', line: 2, column: 10, name: null},
        end: {source: 'foo.js', line: 2, column: 25, name: null}
      },
      skip: undefined
    }
  ],

  branchMap: [
    {
      line: 3, type: 'cond-expr',
      locations: [
        {
          start: {source: 'foo.js', line: 3, column: 19, name: null},
          end: {source: 'foo.js', line: 3, column: 20, name: null},
          skip: undefined
        },
        {
          start: {source: 'foo.js', line: 3, column: 23, name: null},
          end: {source: 'foo.js', line: 3, column: 24, name: null},
          skip: undefined
        }
      ]
    }
  ]
};


function extractExpectInLine(line, { start, end }) {
  return line.substring(start.column, end.column);
}

function extractExpect(location) {
  if (!location) return '';
  let { start, end } = location;
  return start.line === end.line ?
    extractExpectInLine(contentLines[start.line - 1], location) :
    Array.from(
      new Array(end.line - start.line + 1),
      (x,i) => {
        let lastLine = start.line + i === end.line;
        return extractExpectInLine(
          contentLines[start.line - 1 + i],
          {
            start : { column : !i ? start.column : 0 },
            end : { column : lastLine ? end.column : Infinity }
          }
        );
      }
    ).join('\n');
}

describe('Isparta instrumenter', function () {

  before(function () {
    this.instrumenter = new Instrumenter();
  });

  describe('source map hacks', function () {

    before(function (done) {

      this.instrumenter.instrument(content, 'foo.js', (err) => {
        if (err) { console.error(err.stack); }

        let {statementMap, fnMap, branchMap} = this.instrumenter.coverState;

        this.statementMapArray = values(statementMap);
        this.fnMapArray = values(fnMap);
        this.branchMapArray = values(branchMap);

        done();
      });

      function values(arr){ return Object.keys(arr).map(key => arr[key] || []); }

    });

    describe('statement maps', function () {
      it('should localize the statements', function (){
        this.statementMapArray.forEach((loc, i) => {
          expect(loc, `Expect the ${i}-th statements to be deeply equal.`).to.eql(expectedCoverState.statementMap[i] || {});
        });
      });

      it('should match the code snippet', function (){
        this.statementMapArray.forEach((loc, i) => {
          let expectCode = extractExpect(expectedCoverState.statementMap[i]);
          let actualCode = extractExpect(loc);
          expect(actualCode, `Expect the ${i}-th statement to coverthe same code snippet.`).to.equal(expectCode);
        });
      });
    });

    describe('functions maps', function () {
      it('should localize the statements', function (){
        this.fnMapArray.forEach((fn, i) => {
          expect(fn, `Expect the ${i}-th functions to be deeply equal.`).to.eql(expectedCoverState.fnMap[i] || {});
        });
      });

      it('should match the code snippet', function (){
        this.fnMapArray.forEach(({loc}, i) => {
          let expectCode = extractExpect(expectedCoverState.fnMap[i].loc);
          let actualCode = extractExpect(loc);
          expect(actualCode, `Expect the ${i}-th functions to coverthe same code snippet.`).to.equal(expectCode);
        });
      });
    });

    describe('branches maps', function () {
      it('should localize the statements', function (){
        this.branchMapArray.forEach((br, i) => {
          expect(br, `Expect the ${i}-th branches to be deeply equal.`).to.eql(expectedCoverState.branchMap[i] || {});
        });
      });

      it('should match the code snippet', function (){
        this.branchMapArray.forEach(({locations}, i) => {
          locations.forEach((loc, j) => {
            let expectCode = extractExpect(expectedCoverState.branchMap[i].locations[j]);
            let actualCode = extractExpect(loc);
            expect(actualCode, `Expect the ${i}-th branches to coverthe same code snippet.`).to.equal(expectCode);
          });
        });
      });
    });

  });
});

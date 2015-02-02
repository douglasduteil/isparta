//
//

import {expect} from 'chai';
import {Instrumenter, Reporter} from '../src/isparta';

describe('sourcemap hack', function () {

  let instrumenter = new Instrumenter();

  const content = `
ONE.foo = function (bar) {
  return baz(bar ? 0 : 1);
};
`;

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

  it('should correctly localize the statements', (done) => {

    instrumenter.instrument(content, 'foo.js', (err) => {

      if (err) {
        console.error(err.stack);
      }

      let {statementMap} = instrumenter.coverState;

      Object
        .keys(statementMap)
        .map(key => statementMap[key] || [])
        .forEach((loc, i) => {
          expect(loc, `Expect the ${i}-th statements to deeply equal.`).to.eql(expectedCoverState.statementMap[i]);
        });

      done();
    });

  });


  it('should correctly localize the functions', (done) => {

    instrumenter.instrument(content, 'foo.js', (err) => {

      if (err) {
        console.error(err.stack);
      }

      let {fnMap} = instrumenter.coverState;

      Object
        .keys(fnMap)
        .map(key => fnMap[key] || [])
        .forEach((fn, i) => {
          expect(fn, `Expect the ${i}-th functions to deeply equal.`).to.eql(expectedCoverState.fnMap[i]);
        });

      done();
    });

  });


  it('should correctly localize the branches', (done) => {

    instrumenter.instrument(content, 'foo.js', (err) => {

      if (err) {
        console.error(err.stack);
      }

      let {branchMap} = instrumenter.coverState;

      Object
        .keys(branchMap)
        .map(key => branchMap[key] || [])
        .forEach((br, i) => {
          expect(br, `Expect the ${i}-th branches to deeply equal.`).to.eql(expectedCoverState.branchMap[i]);
        });

      done();
    });

  });

});

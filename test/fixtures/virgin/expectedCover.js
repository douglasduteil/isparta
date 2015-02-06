// Compiled to

// 0. "use strict";
// 1.
// 2. ONE.foo = function (bar) {
// 3.   return baz(bar ? 0 : 1);
// 4. };


module.exports = {
  statementMap: [
    {
      // 2. ONE.foo = function (bar) {
      // 3.   return baz(bar ? 0 : 1);
      // 4. };
      start: {source: 'virgin/actual.js', line: 2, column: 0, name: null},
      end: {source: 'virgin/actual.js', line: 4, column: 2, name: null},
      skip: undefined
    },
    {
      // 3.   return baz(bar ? 0 : 1);
      start: {source: 'virgin/actual.js', line: 3, column: 2, name: null},
      end: {source: 'virgin/actual.js', line: 3, column: 26, name: null},
      skip: undefined
    }
  ],

  fnMap: [
    {
      // 2. ONE.foo = function (bar) {
      name: '(anonymous_1)', line: 2,
      loc: {
        start: {source: 'virgin/actual.js', line: 2, column: 10, name: null},
        end: {source: 'virgin/actual.js', line: 2, column: 25, name: null}
      },
      skip: undefined
    }
  ],

  branchMap: [
    {
      // 3.   return baz(bar ? 0 : 1);
      line: 3, type: 'cond-expr',
      locations: [
        {
          start: {source: 'virgin/actual.js', line: 3, column: 19, name: null},
          end: {source: 'virgin/actual.js', line: 3, column: 20, name: null},
          skip: undefined
        },
        {
          start: {source: 'virgin/actual.js', line: 3, column: 23, name: null},
          end: {source: 'virgin/actual.js', line: 3, column: 24, name: null},
          skip: undefined
        }
      ]
    }
  ]
};

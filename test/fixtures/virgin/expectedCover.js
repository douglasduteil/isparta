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
      start: {line: 2, column: 0},
      end: {line: 4, column: 2},
      skip: undefined
    },
    {
      // 3.   return baz(bar ? 0 : 1);
      start: {line: 3, column: 2},
      end: {line: 3, column: 26},
      skip: undefined
    }
  ],

  fnMap: [
    {
      // 2. ONE.foo = function (bar) {
      name: '(anonymous_1)', line: 2,
      loc: {
        start: {line: 2, column: 10},
        end: {line: 2, column: 25}
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
          start: {line: 3, column: 19},
          end: {line: 3, column: 20},
          skip: undefined
        },
        {
          start: {line: 3, column: 23},
          end: {line: 3, column: 24},
          skip: undefined
        }
      ]
    }
  ]
};

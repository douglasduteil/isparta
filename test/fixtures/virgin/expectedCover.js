// Compiled to

// 1. "use strict";
// 2.
// 3. ONE.foo = function (bar) {
// 4.   return baz(bar ? 0 : 1);
// 5. };


module.exports = {
  statementMap: [
    {
      // 3. ONE.foo = function (bar) {
      // 4.   return baz(bar ? 0 : 1);
      // 5. };
      start: {line: 3, column: 0},
      end: {line: 5, column: 2}
    },
    {
      // 4.   return baz(bar ? 0 : 1);
      start: {line: 4, column: 2},
      end: {line: 4, column: 26}
    }
  ],

  fnMap: [
    {
      // 3. ONE.foo = function (bar) {
      name: '(anonymous_1)', line: 3,
      loc: {
        start: {line: 3, column: 10},
        end: {line: 3, column: 25}
      }
    }
  ],

  branchMap: [
    {
      // 4.   return baz(bar ? 0 : 1);
      line: 4, type: 'cond-expr',
      locations: [
        {
          start: {line: 4, column: 19},
          end: {line: 4, column: 20}
        },
        {
          start: {line: 4, column: 23},
          end: {line: 4, column: 24}
        }
      ]
    }
  ]
};

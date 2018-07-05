// Compiled to

//  1. "use strict";
//  2.
//  3. ONE.foo = function (bar) {
//  4.   return baz(bar ? 0 : 1);
//  5. };
//  6.
//  7. /* istanbul ignore next */
//  8. if (true) {
//  9.   var a = 5;
// 10. }

module.exports = {
  statementMap: [
    {
      //  3.
      start: { line: 3, column: 0 },
      end: { line: 3, column: 0 }
    },
    {
      //  4.
      start: { line: 4, column: 2 },
      end: { line: 4, column: 2 }
    },
    {
      //  5. };
      //  6.
      //  7. /* istanbul ignore next */
      //  8. if (true) {
      //  9.   var a = 5;
      // 10. }
      start: { line: 8, column: 0 },
      end: { line: 10, column: 1 },
      skip: true
    },
    {
      //  9.   var a = 5;
      start: { line: 9, column: 2 },
      end: { line: 9, column: 2 },
      skip: true
    }
  ],

  fnMap: [
    {
      //  3. ONE.foo = function (bar) {
      name: '(anonymous_1)',
      line: 3,
      loc: {
        start: { line: 3, column: 10 },
        end: { line: 3, column: 25 }
      }
    }
  ],

  branchMap: [
    {
      //  4.   return baz(bar ? 0 : 1);
      line: 4,
      type: 'cond-expr',
      locations: [
        {
          start: { line: 4, column: 19 },
          end: { line: 4, column: 13 }
        },
        {
          start: { line: 4, column: 23 },
          end: { line: 4, column: 9 }
        }
      ]
    },
    {
      //  5. };
      //  6.
      //  7. /* istanbul ignore next */
      //  8. if (true) {
      line: 8,
      type: 'if',
      locations: [
        {
          start: { line: 8, column: 0 },
          end: { line: 8, column: 0 },
          skip: true
        },
        {
          start: { line: 8, column: 0 },
          end: { line: 8, column: 0 },
          skip: true
        }
      ]
    }
  ]
};

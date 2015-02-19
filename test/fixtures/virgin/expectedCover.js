// Compiled to

module.exports = {
  statementMap: [
    {
      // 3. var ONE = {};
      start: {line: 3, column: 0},
      end: {line: 3, column: 13},
      skip: undefined
    },
    {
      // 5. ONE.foo = function (bar) {
      // 6.   return baz(bar ? 0 : 1);
      // 7. };
      start: {line: 5, column: 0},
      end: {line: 7, column: 2},
      skip: undefined
    },
    {
      // 6.   return baz(bar ? 0 : 1);
      start: {line: 6, column: 2},
      end: {line: 6, column: 26},
      skip: undefined
    },
    {
      // 10. ONE.bar = function (){};
      start: {line: 10, column: 0},
      end: {line: 10, column: 24},
      skip: true
    }
  ],

  fnMap: [
    {
      // 5. ONE.foo = function (bar) {
      name: '(anonymous_1)', line: 5,
      loc: {
        start: {line: 5, column: 10},
        end: {line: 5, column: 25}
      },
      skip: undefined
    },
    {
      // 10. ONE.bar = function (){};
      name: '(anonymous_2)', line: 10,
      loc: {
        start: {line: 10, column: 10},
        end: {line: 10, column: 21}
      },
      skip: true
    }
  ],

  branchMap: [
    {
      // 6.   return baz(bar ? 0 : 1);
      line: 6, type: 'cond-expr',
      locations: [
        {
          start: {line: 6, column: 19},
          end: {line: 6, column: 20},
          skip: undefined
        },
        {
          start: {line: 6, column: 23},
          end: {line: 6, column: 24},
          skip: undefined
        }
      ]
    }
  ]
};

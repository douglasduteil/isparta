// Compiled to ./compiled.js

const lostStatment = {
  start: {line: 0, column: 0},
  end: {line: 0, column: 0}
};

const skippedStatment = {
  ...lostStatment,
  skip: true
};

function generateNSkipedStatement(n){
  return Array.from(Array(n)).map(() => skippedStatment );
}

module.exports = {
  statementMap: []
    .concat(generateNSkipedStatement(8))
    .concat([
      // 9th statement
      {
        start: {line: 3, column: 0},
        end: {line: 15, column: 1},
      }
    ])
    .concat(generateNSkipedStatement(3))
    .concat([
      // 13th statement
      {
        start: {line: 13, column: 4},
        end: {line: 13, column: 20}
      },
      // 14th statement
      {
        start: {line: 5, column: 4},
        end: {line: 5, column: 45}
      },
      // 15th statement
      {
        start: {line: 9, column: 4},
        end: {line: 9, column: 19}
      }
    ])
    .concat(generateNSkipedStatement(3))
  ,

  fnMap: [
   {
      name: '(anonymous_1)', line: 3,
      loc: {
       ...lostStatment
      },
      skip: true
    },
    {
      name: '(anonymous_2)', line: 5,
      loc: {
       ...lostStatment
      },
      skip: true
    },
    {
      name: '(anonymous_3)', line: 9,
      loc: {
        start: {line: 3, column: 10},
        end: {line: 3, column: 10}
      }
    },
    {
      name: 'Animal', line: 10,
      loc: {
        ...lostStatment
      },
      skip: true
    },
    {
      name: 'getName', line: 16,
      loc: {
        start: {line: 12, column: 16},
        end: {line: 12, column: 19}
      }
    },
    {
      name: 'sayHi', line: 24,
      loc: {
        start: {line: 4, column: 7},
        end: {line: 4, column: 10}
      }
    },
    {
      name: 'sayOther', line: 31,
      loc: {
        start: {line: 8, column: 10},
        end: {line: 8, column: 13}
      }
    }
  ],

  branchMap: [
    {
      line: 3, type: 'if',
      locations: [{...skippedStatment}, {...skippedStatment}]
    },
    {
      line: 3, type: 'if',
      locations: [{...skippedStatment}, {...skippedStatment}]
    },
    {
      line: 5, type: 'if',
      locations: [{...skippedStatment}, {...skippedStatment}]
    }
  ]
};

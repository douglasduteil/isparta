// Compiled to ./compiled.js

const skippedStatment = {
  start: {line: 1, column: -15},
  end: {line: 1, column: -15},
  skip: true
};

function generateNSkipedStatement(n){
  return Array.from(Array(n)).map(() =>  skippedStatment);
}

module.exports = {
  statementMap: generateNSkipedStatement(8)
    .concat([
      // 9th statement
      {
        start: {line: 3, column: 0},
        end: {line: 15, column: 1},
        skip: undefined
      }
    ])
    .concat(generateNSkipedStatement(3))
    .concat([
      // 13th statement
      {
        start: {line: 13, column: 4},
        end: {line: 13, column: 20},
        skip: undefined
      },
      // 14th statement
      {
        start: {line: 5, column: 4},
        end: {line: 5, column: 45},
        skip: undefined
      },
      // 15th statement
      {
        start: {line: 9, column: 4},
        end: {line: 9, column: 19},
        skip: undefined
      }
    ])
    .concat(generateNSkipedStatement(3))
  ,

  fnMap: [
   {
      name: '(anonymous_1)', line: 1,
      loc: {
       ...skippedStatment
      },
      skip: undefined
    },
    {
      name: '(anonymous_2)', line: 1,
      loc: {
       ...skippedStatment
      },
      skip: undefined
    },
    {
      name: '(anonymous_3)', line: 3,
      loc: {
        start: {line: 3, column: 10},
        end: {line: 3, column: 10}
      },
      skip: undefined
    },
    {
      name: 'Animal', line: 1,
      loc: {
        ...skippedStatment
      },
      skip: undefined
    },
    {
      name: 'getName', line: 12,
      loc: {
        start: {line: 12, column: 16},
        end: {line: 12, column: 19}
      },
      skip: undefined
    },
    {
      name: 'sayHi', line: 4,
      loc: {
        start: {line: 4, column: 7},
        end: {line: 4, column: 10}
      },
      skip: undefined
    },
    {
      name: 'sayOther', line: 8,
      loc: {
        start: {line: 8, column: 10},
        end: {line: 8, column: 13}
      },
      skip: undefined
    }
  ],

  branchMap: [
    {
      line: 1, type: 'if',
      locations: [{...skippedStatment}, {...skippedStatment}]
    },
    {
      line: 1, type: 'if',
      locations: [{...skippedStatment}, {...skippedStatment}]
    },
    {
      line: 1, type: 'if',
      locations: [{...skippedStatment}, {...skippedStatment}]
    }
  ]
};

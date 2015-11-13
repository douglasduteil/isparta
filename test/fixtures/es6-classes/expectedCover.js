// Compiled to ./compiled.js

const lostStatment = {
  start: {line: 0, column: 0},
  end: {line: 0, column: 0}
};

const skippedStatment = {
  ...lostStatment,
  skip: true
};

////

function generateNSkipedStatement(n){
  return Array.from(Array(n)).map(() => skippedStatment );
}

function generateNSkipedFunction(...lostFnData){
  return lostFnData.map(fnData => {
    return {
      ...fnData, loc: {...skippedStatment}, skip: true
    };
  });
}

function generateNSkipedBranch(...lostBranchData){
  return lostBranchData.map(branchData => {
    return {
      ...branchData, locations: [{...skippedStatment}, {...skippedStatment}]
    };
  });
}

////

module.exports = {
  statementMap: []
    .concat(generateNSkipedStatement(19))
    .concat([
      // 20th statement
      {
        start: {line: 3, column: 0},
        end: {line: 15, column: 1},
      }
    ])
    .concat(generateNSkipedStatement(3))
    .concat([
      // 24th statement
      {
        start: {line: 5, column: 4},
        end: {line: 5, column: 45}
      },
      // 25th statement
      {
        start: {line: 9, column: 4},
        end: {line: 9, column: 19}
      },
      // 26th statement
      {
        start: {line: 13, column: 4},
        end: {line: 13, column: 20}
      }
    ])
    .concat(generateNSkipedStatement(2))
  ,

  fnMap: []
    .concat(generateNSkipedFunction(
      {name: '(anonymous_1)', line: 3},
      {name: 'defineProperties', line: 3},
      {name: '(anonymous_3)', line: 3},
      {name: '_classCallCheck', line: 9}
    ))
    .concat([
      // 5th fn
      {
        name: '(anonymous_5)', line: 13,
        loc: {
          start: {line: 3, column: 10},
          end: {line: 3, column: 10}
        }
      }
    ])
    .concat(generateNSkipedFunction(
      {name: 'Animal', line: 14}
    ))
    .concat(generateNSkipedFunction(
      {name: 'sayHi', line: 20}
    ))
    .concat(generateNSkipedFunction(
      {name: 'sayOther', line: 25}
    ))
    .concat(generateNSkipedFunction(
      {name: 'getName', line: 30}
    )),

  branchMap: generateNSkipedBranch(
    // 1th branch
    {line: 3, type: 'binary-expr'},
    // 2th branch
    {line: 3, type: 'if'},
    // 3th branch
    {line: 3, type: 'if'},
    // 4th branch
    {line: 3, type: 'if'},
    // 5th branch
    {line: 9, type: 'if'}
  )
};

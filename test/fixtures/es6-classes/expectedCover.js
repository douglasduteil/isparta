// Compiled to ./compiled.js

const lostStatment = {
  start: { line: 0, column: 0 },
  end: { line: 0, column: 0 }
};

const skippedStatment = {
  ...lostStatment,
  skip: true
};

////

function generateNSkipedStatement(n) {
  return Array.from(Array(n)).map(() => skippedStatment);
}

function generateNSkipedFunction(...lostFnData) {
  return lostFnData.map(fnData => {
    return { ...fnData, loc: { ...(fnData.loc || skippedStatment) } };
  });
}

function generateNSkipedBranch(...lostBranchData) {
  return lostBranchData.map(branchData => {
    return {
      ...branchData,
      locations: [{ ...skippedStatment }, { ...skippedStatment }]
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
        start: { line: 3, column: 0 },
        end: { line: 3, column: 0 }
      },
      // 21th statement
      {
        start: { line: 3, column: 4 },
        end: { line: 3, column: 4 }
      },
      // 22th statement
      {
        start: { line: 3, column: 4 },
        end: { line: 3, column: 4 }
      },
      // 23th statement
      {
        start: { line: 3, column: 4 },
        end: { line: 3, column: 4 }
      },
      // 24th statement
      {
        start: { line: 5, column: 4 },
        end: { line: 5, column: 4 }
      },
      // 25th statement
      {
        start: { line: 9, column: 4 },
        end: { line: 9, column: 4 }
      },
      // 26th statement
      {
        start: { line: 13, column: 4 },
        end: { line: 13, column: 4 }
      },
      // 26th statement
      {
        start: { line: 3, column: 4 },
        end: { line: 3, column: 4 }
      }
    ])
    .concat(generateNSkipedStatement(1)),
  fnMap: []
    .concat(
      generateNSkipedFunction(
        { name: '(anonymous_1)', line: 7, skip: true },
        { name: 'defineProperties', line: 7, skip: true },
        { name: '(anonymous_3)', line: 7, skip: true },
        { name: '_classCallCheck', line: 9, skip: true }
      )
    )
    .concat([
      // 5th fn
      {
        name: '(anonymous_5)',
        line: 13,
        loc: {
          start: { line: 3, column: 4 },
          end: { line: 3, column: 4 }
        }
      }
    ])
    .concat(
      generateNSkipedFunction({
        name: 'Animal',
        line: 14,
        loc: {
          start: { line: 3, column: 4 },
          end: { line: 3, column: 4 }
        }
      })
    )
    .concat(
      generateNSkipedFunction({
        name: 'sayHi',
        line: 20,
        loc: {
          start: { line: 3, column: 4 },
          end: { line: 4, column: 10 }
        }
      })
    )
    .concat(
      generateNSkipedFunction({
        name: 'sayOther',
        line: 25,
        loc: {
          start: { line: 3, column: 4 },
          end: { line: 8, column: 13 }
        }
      })
    )
    .concat(
      generateNSkipedFunction({
        name: 'getName',
        line: 30,
        loc: {
          start: { line: 3, column: 4 },
          end: { line: 12, column: 19 }
        }
      })
    ),

  branchMap: generateNSkipedBranch(
    // 1th branch
    { line: 7, type: 'binary-expr' },
    // 2th branch
    { line: 7, type: 'if' },
    // 3th branch
    { line: 7, type: 'if' },
    // 4th branch
    { line: 7, type: 'if' },
    // 5th branch
    { line: 9, type: 'if' }
  )
};

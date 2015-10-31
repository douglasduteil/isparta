//

import hideStack from 'hide-stack-frames-from'
hideStack('mocha', 'babel-core');

import Mocha from 'mocha'
let {Test, Suite} = Mocha;

import {expect} from 'chai'
import {appendSuffix as nth} from 'nth'


import {getFixturesTest, extractCodeExpect} from './_helpers.js';

import {Instrumenter, Reporter} from '../src/isparta';

////

const MAP_TYPES = [
  {
    name: 'statement',
    get fullName() { return `${this.name}Map` },
    getLocations: (loc) => [loc]
  },
  {
    name: 'fn',
    get fullName() { return `${this.name}Map` },
    getLocations: (fn) => [fn.loc]
  },
  {
    name: 'branch',
    get fullName() { return `${this.name}Map` },
    getLocations: (br) => br.locations
  }
];

////

let instumenterSuite = describe("Isparta instrumenter", function () {
  before(generateSourceMapTest);

  it('should generate the tests', function () {
    expect(instumenterSuite.suites.length).to.be.above(0);
  });

});

function generateSourceMapTest(allDone) {

  let instrumenter = new Instrumenter();
  const fixturesToTest = getFixturesTest();
  const done = after(fixturesToTest.length, allDone);

  fixturesToTest.map((fixtureTest) => {

    let {name, actual} = fixtureTest;

    instrumenter.instrument(actual.code, actual.loc, (err) => {
      if (err) { throw err; }

      let fixtureSuite = Suite.create(instumenterSuite, `when ${name}`);
      fixtureSuite.afterEach('display code snippet diff', displaySnippetError);

      MAP_TYPES
        .map(testCoverMaps(instrumenter.coverState, fixtureTest))
        .reduce((coverTests, tests) => coverTests.concat(tests), [])
        .forEach((test) => fixtureSuite.addTest(test));


      done();
    });
  });


}

function displaySnippetError() {
  if (!this.error) {
    return;
  }

  let codeLines = this.error.codeLines;

  this.error.expectedLocation.forEach((expectedLoc, i) => {
    let actualLoc = this.error.actualLocation[i];
    let expectCode = extractCodeExpect(codeLines, expectedLoc);
    let actualCode = extractCodeExpect(codeLines, actualLoc);
    //console.log('<<<<<<<< expectCode | ', expectCode);
    //console.log('<<<<<<<< actualCode | ', actualCode);
    expect(actualCode).to.equal(expectCode);
  });

}


function testCoverMaps(maps, fixtureTest) {

  var actualCodeLines = fixtureTest.actual.code.split('\n');

  return function testCoverMap(type) {
    let mapKey = `${type.name}Map`;
    let map = values(maps[mapKey] || {});

    return map.map((loc, i) => {

      return new Test(`should localize the ${nth(i + 1)} ${type.name}`, locationIt);

      ////

      function locationIt() {

        this.error = {
          actualLocation: type.getLocations(loc),
          expectedLocation: type.getLocations(
            fixtureTest.expectedCover.code[mapKey][i] || {}
          ) || [],
          codeLines: actualCodeLines
        };

        expect(loc).to.eql(fixtureTest.expectedCover.code[mapKey][i] || {},
          `Expect the ${nth(i + 1)} ${type.name}s to be deeply equal.`);

        this.error = null;

      }

    });
  }

}

//

// Minimal Lodash util functions
function values(arr) { return Object.keys(arr).map(key => arr[key] || {}); }
function after(n, func) { return function () {
  if (--n < 1) { return func.apply(this, arguments); }
};}

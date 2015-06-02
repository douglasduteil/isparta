
import {expect} from 'chai';

// using require here instead of import to avoid babel messing with it
const istanbul = require('istanbul');
const isparta = require('../');

describe('API', function () {
  it('should include all the public istanbul symbols', function () {
    expect(isparta).to.contain.all.keys(istanbul);
  });
});

//

import {expect} from 'chai'
import shelltest from 'douglasduteil...shelltest'

import pkg from '../package.json'

//

var BIN = pkg.bin['isparta'];

describe('Isparta bin', function () {
  this.slow(1500);

  it('should throws with no commands', function (done) {
    shelltest()
      .cmd(BIN)
      .expect(1)
      .expect('stdout', /command argument is required/)
      .end(function (err) {
        if (err.name === 'AssertionError') { return done(err); }
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.match(/Command failed:/);
        done();
      })
  });

  describe('command "cover"', function () {

    it('should throws with no cmd option', function (done) {
      shelltest()
        .cmd(BIN + ' cover')
        .expect(1)
        .expect('stdout', /cmd argument is required/)
        .end(function (err) {
          if (err.name === 'AssertionError') { return done(err); }
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.match(/Command failed:/);
          done();
        })
    });

    it('should throws if the cmd to cover is not found', function (done) {
      shelltest()
        .cmd(BIN + ' cover foo.js')
        .expect(1)
        .expect('stderr', /Unable to resolve file \[foo\.js\]/)
        .end(function (err) {
          if (err.name === 'AssertionError') { return done(err); }
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.match(/Command failed:/);
          done();
        })
    });

  });
});

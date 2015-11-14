//

import {expect, default as chai} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import ArgParser from '../src/cli/ArgParser'

//

chai.use(sinonChai);

//

describe('ArgParser', function () {
  var commands;
  var parser;

  beforeEach(function () {
    commands = {
      cover: sinon.spy()
    };

    parser = ArgParser(commands).nocolors();
    parser.print = sinon.stub();
    parser.printer(parser.print);
  });

  describe('no command', function () {
    it('should require a command', function () {
      parser.parse([]);
      expect(parser.print).to.have.been.calledWithMatch(/command argument is required/);
    });
  });

  describe('cover command', function () {

    it('should require a file', function () {
      parser.parse(['cover']);
      expect(parser.print).to.have.been.calledWithMatch(/cmd argument is require/);
    });

    it('should run with default options', function () {
      parser.parse(['cover', 'foo.js']);
      expect(commands.cover).to.have.been.calledWithMatch({
        cmd: 'foo.js',
        excludes: [],
        include: ['**/*.js'],
        report: 'lcv'
      });
    });

    describe('--config', function () {
      it('should throw without value', function () {
        parser.parse(['cover', 'foo.js', '--config']);
        expect(parser.print).to.have.been.calledWithMatch(/'--config' expects a value/);
      });

      it('should run with the config in option', function () {
        parser.parse(['cover', 'foo.js', '--config', 'myconfig.yml']);
        expect(commands.cover).to.have.been.calledWithMatch({
          config: 'myconfig.yml'
        });
      });
    });

    describe('--default-excludes', function () {
      it('should run with the default-excludes in option', function () {
        parser.parse(['cover', 'foo.js', '--default-excludes']);
        expect(commands.cover).to.have.been.calledWithMatch({
          'default-excludes': true
        });
      });
    });

    describe('--excludes', function () {
      it('should throw without value', function () {
        parser.parse(['cover', 'foo.js', '--excludes']);
        expect(parser.print).to.have.been.calledWithMatch(/'--excludes' expects a value/);
      });

      it('should run with the excludes in option', function () {
        parser.parse(['cover', 'foo.js', '--excludes', 'excluded.file']);
        expect(commands.cover).to.have.been.calledWithMatch({
          excludes: ['excluded.file']
        });
      });

      it('should run with the multiple flag', function () {
        parser.parse(['cover', 'foo.js', '--excludes', 'x', '--excludes', 'y', '--excludes', 'z']);
        expect(commands.cover).to.have.been.calledWithMatch({
          excludes: ['x', 'y', 'z']
        });
      });

      it('should work with the -x alias', function () {
        parser.parse(['cover', 'foo.js', '-x', 'excluded.file']);
        expect(commands.cover).to.have.been.calledWithMatch({
          excludes: ['excluded.file']
        });
      });
    });

    describe('--report', function () {
      it('should throw without value', function () {
        parser.parse(['cover', 'foo.js', '--report']);
        expect(parser.print).to.have.been.calledWithMatch(/'--report' expects a value/);
      });

      it('should run with the report in option', function () {
        parser.parse(['cover', 'foo.js', '--report', 'report-format']);
        expect(commands.cover).to.have.been.calledWithMatch({
          report: ['report-format']
        });
      });

      it('should run with the multiple flag', function () {
        parser.parse(['cover', 'foo.js', '--report', 'x', '--report', 'y', '--report', 'z']);
        expect(commands.cover).to.have.been.calledWithMatch({
          report: ['x', 'y', 'z']
        });
      });
    });

    describe('--include', function () {
      it('should throw without value', function () {
        parser.parse(['cover', 'foo.js', '--include']);
        expect(parser.print).to.have.been.calledWithMatch(/'--include' expects a value/);
      });

      it('should run with the include in option', function () {
        parser.parse(['cover', 'foo.js', '--include', 'excluded.file']);
        expect(commands.cover).to.have.been.calledWithMatch({
          include: ['excluded.file']
        });
      });

      it('should run with the multiple flag', function () {
        parser.parse(['cover', 'foo.js', '--include', 'x', '--include', 'y', '--include', 'z']);
        expect(commands.cover).to.have.been.calledWithMatch({
          include: ['x', 'y', 'z']
        });
      });

      it('should work with the -i alias', function () {
        parser.parse(['cover', 'foo.js', '-i', 'included.file']);
        expect(commands.cover).to.have.been.calledWithMatch({
          include: ['included.file']
        });
      });
    });

    describe('--verbose', function () {
      it('should run with the verbose in option', function () {
        parser.parse(['cover', 'foo.js', '--verbose']);
        expect(commands.cover).to.have.been.calledWithMatch({
          verbose: true
        });
      });
    });

    describe('--include-all-sources', function () {
      it('should run with the include-all-sources in option', function () {
        parser.parse(['cover', 'foo.js', '--include-all-sources']);
        expect(commands.cover).to.have.been.calledWithMatch({
          'include-all-sources': true
        });
      });
    });
  });
});

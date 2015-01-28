//

import {existsSync, writeFileSync} from 'fs';
import path from 'path';
import Module from 'module';

//
import which from 'which';
import partial from 'lodash.partial';
import nomnom from 'nomnom';
import {hook, Reporter, matcherFor, config as configuration} from 'istanbul';
import {Instrumenter} from './instrumenter';

//


//

nomnom.command('cover')
  .help("transparently adds coverage information to a node command. Saves coverage.json and reports at the end of execution")

  .option('cmd', {
    required: true,
    position: 1,
    help: 'ES6 js files to cover (using 6to5)'
  })

  .option('config', {
    metavar: '<path-to-config>',
    help: 'the configuration file to use, defaults to .istanbul.yml'
  })
  .option('report', {
    metavar: '<format>',
    list: true,
    help: `report format, defaults to ['lcv']`
  })
  .option('root', {
    metavar: '<path>',
    help: 'the root path to look for files to instrument, defaults to .'
  })
  .option('verbose', {
    flag: true,
    abbr: 'v',
    help: 'verbose mode'
  })

  .callback(coverCmd)
;

nomnom.nom();

function callback(err){
  if (err){
    console.error(err);
    process.exit(1);
  }
  process.exit(0);
}

function coverCmd(opts) {

  let overrides = {
    verbose: opts.verbose
  };

  let config = configuration.loadFile(opts.config, overrides);
  let reporter = new Reporter(config);

  let { cmd, cmdArgs } = opts;

  if (!existsSync(cmd)) {
    try {
      cmd = which.sync(cmd);
    } catch (ex) {
      return callback(`Unable to resolve file [${cmd}]`);
    }
  } else {
    cmd = path.resolve(cmd);
  }


  function runFn() {
    process.argv = ["node", cmd].concat(cmdArgs);
    if (opts.verbose) {
      console.log('Running: ' + process.argv.join(' '));
    }
    process.env.running_under_istanbul=1;
    Module.runMain(cmd, null, true);
  }

  let excludes = config.instrumentation.excludes(true);
  let reportingDir = path.resolve(config.reporting.dir());
  excludes.push(path.relative(process.cwd(), path.join(reportingDir, '**', '*')));

  matcherFor({
    root: config.instrumentation.root() || process.cwd(),
    includes: [ '**/*.js' ],
    excludes: excludes
  }, (err, matchFn) => {
    if (err){
      callback(err);
    }

    let coverageVar = `$$cov_${Date.now()}$$`;
    let instrumenter = new Instrumenter({ coverageVariable : coverageVar });
    let transformer = instrumenter.instrumentSync.bind(instrumenter);

    hook.hookRequire(matchFn, transformer, { verbose : opts.verbose });

    //initialize the global variable to stop mocha from complaining about leaks
    global[coverageVar] = {};

    // enable passing --handle-sigint to write reports on SIGINT.
    // This allows a user to manually kill a process while
    // still getting the istanbul report.
    if (config.hooks.handleSigint()) {
      process.once('SIGINT', process.exit);
    }

    process.once('exit', () => {
      let file = path.resolve(reportingDir, 'coverage.json');
      let cov;

      if (typeof global[coverageVar] === 'undefined' || Object.keys(global[coverageVar]).length === 0) {
        console.error('No coverage information was collected, exit without writing coverage information');
        return;
      } else {
        cov = global[coverageVar];
      }

      writeFileSync(file, JSON.stringify(cov), 'utf8');
    });

    if (config.instrumentation.includeAllSources()) {
      matchFn.files.forEach(function (file) {
        if (opts.verbose) { console.error('Preload ' + file); }
        try {
          require(file);
        } catch (ex) {
          if (opts.verbose) {
            console.error('Unable to preload ' + file);
          }
          // swallow
        }
      });
    }

    runFn();
  })
}

//

import {existsSync, writeFileSync, statSync, readdirSync} from 'fs';
import path from 'path';
import Module from 'module';

//
import which from 'which';
import mkdirp from 'mkdirp';
import partial from 'lodash.partial';
import nomnom from 'nomnom';
import {hook, Collector, Reporter, matcherFor, config as configuration} from 'istanbul';
import {Instrumenter} from './instrumenter';

//


//

nomnom.command('cover')
  .help("transparently adds coverage information to a node command. Saves coverage.json and reports at the end of execution")

  .option('cmd', {
    required: true,
    position: 1,
    help: 'ES6 js files to cover (using babel)'
  })

  .option('config', {
    metavar: '<path-to-config>',
    help: 'the configuration file to use, defaults to .istanbul.yml'
  })
  .option('report', {
    default: 'lcv',
    metavar: '<format>',
    list: true,
    help: `report format, defaults to ['lcv']`
  })
  .option('root', {
    metavar: '<path>',
    help: 'the root path to look for files to instrument, defaults to .'
  })
  .option('include', {
    default: ['**/*.js'],
    metavar: '<include-pattern>',
    list: true,
    abbr: 'i',
    help: 'one or more fileset patterns e.g. \'**/*.js\''
  })
  .option('verbose', {
    flag: true,
    abbr: 'v',
    help: 'verbose mode'
  })

  .callback(opts => {

    let args = opts._,
        files = [],
        cmdArgs = [];

    args.forEach(arg => {

        let file = lookupFiles(arg);
        if (file) files = files.concat(file);
    });

    opts.include = opts.include.concat(files);

    coverCmd(opts);
  });
;

nomnom.nom();

function lookupFiles (path) {

  if (existsSync(path)) {
    let stat = statSync(path);
    if (stat.isFile()) return path;
  }
}

function callback(err){
  if (err){
    console.error(err);
    process.exit(1);
  }
  process.exit(0);
}

function coverCmd(opts) {

  let config = overrideConfigWith(opts);
  let reporter = new Reporter(config, _path.resolve('./' + config.reporting.dir()));

  let { cmd } = opts;
  let cmdArgs = opts['--'] || [];

  if (!existsSync(cmd)) {
    try {
      cmd = which.sync(cmd);
    } catch (ex) {
      return callback(`Unable to resolve file [${cmd}]`);
    }
  } else {
    cmd = path.resolve(cmd);
  }

  if (opts.verbose) console.error('Isparta options : \n ', opts);

  let excludes = config.instrumentation.excludes(true);
  enableHooks();


  ////

  function overrideConfigWith(opts){

    let overrides = {
      verbose: opts.verbose,
      instrumentation: {
        root: opts.root,
        'default-excludes': opts['default-excludes'],
        excludes: opts.x,
        'include-all-sources': opts['include-all-sources'],
        'preload-sources': opts['preload-sources']
      },
      reporting: {
        reports: opts.report,
        print: opts.print,
        dir: opts.dir
      },
      hooks: {
        'hook-run-in-context': opts['hook-run-in-context'],
        'post-require-hook': opts['post-require-hook'],
        'handle-sigint': opts['handle-sigint']
      }
    };

    return configuration.loadFile(opts.config, overrides);
  }

  function enableHooks() {
    opts.reportingDir = path.resolve(config.reporting.dir());
    mkdirp.sync(opts.reportingDir);
    reporter.addAll(config.reporting.reports());

    if (config.reporting.print() !== 'none') {
      switch (config.reporting.print()) {
        case 'detail':
          reporter.add('text');
          break;
        case 'both':
          reporter.add('text');
          reporter.add('text-summary');
          break;
        default:
          reporter.add('text-summary');
          break;
      }
    }

    excludes.push(path.relative(process.cwd(), path.join(opts.reportingDir, '**', '*')));

    matcherFor({
      root: config.instrumentation.root() || process.cwd(),
      includes: opts.include,
      excludes: excludes
    }, (err, matchFn) => {
      if (err){
        return callback(err);
      }

      prepareCoverage(matchFn);
      runCommandFn();
    });
  }


  function prepareCoverage(matchFn) {
    let coverageVar = `$$cov_${Date.now()}$$`;
    let instrumenter = new Instrumenter({ coverageVariable : coverageVar });
    let transformer = instrumenter.instrumentSync.bind(instrumenter);

    hook.hookRequire(matchFn, transformer, Object.assign({ verbose : opts.verbose }, config.instrumentation.config));

    global[coverageVar] = {};

    if (config.hooks.handleSigint()) {
      process.once('SIGINT', process.exit);
    }

    process.once('exit', (code) => {
      if (code) {
        process.exit(code);
      }
      let file = path.resolve(opts.reportingDir, 'coverage.json');
      let cov, collector;

      if (typeof global[coverageVar] === 'undefined' || Object.keys(global[coverageVar]).length === 0) {
        console.error('No coverage information was collected, exit without writing coverage information');
        return;
      } else {
        cov = global[coverageVar];
      }

      mkdirp.sync(opts.reportingDir);
      if (config.reporting.print() !== 'none') {
        console.error(Array(80 + 1).join('='));
        console.error(`Writing coverage object [${file}]`);
      }
      writeFileSync(file, JSON.stringify(cov), 'utf8');
      collector = new Collector();
      collector.add(cov);
      if (config.reporting.print() !== 'none') {
        console.error(`Writing coverage reports at [${opts.reportingDir}]`);
        console.error(Array(80 + 1).join('='));
      }
      reporter.write(collector, true, callback);
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

  }

  function runCommandFn() {
    process.argv = ["node", cmd].concat(cmdArgs);
    if (opts.verbose) {
      console.log('Running: ' + process.argv.join(' '));
    }
    process.env.running_under_istanbul=1;
    Module.runMain(cmd, null, true);
  }
}

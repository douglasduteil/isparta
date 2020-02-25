//

import {existsSync, writeFileSync} from 'fs';
import {Instrumenter} from '../../instrumenter';
import {hook, Collector, Reporter, matcherFor, config as configuration} from 'istanbul';
import mkdirp from 'mkdirp';
import Module from 'module';
import assign from 'object-assign';
import path from 'path';
import which from 'which';

//

export default coverCmd

//

function coverCmd (opts) {
  let config = overrideConfigWith(opts);
  let istanbulCoveragePath = path.resolve(config.reporting.dir());
  let reporter = new Reporter(config, istanbulCoveragePath);

  let { cmd } = opts;
  let cmdArgs = opts['--'] || [];

  if (!existsSync(cmd)) {
    try {
      cmd = which.sync(cmd);
    } catch (ex) {
      return processEnding(`Unable to resolve file [${cmd}]`);
    }
  } else {
    cmd = path.resolve(cmd);
  }

  if (opts.verbose) console.error('Isparta options : \n ', opts);

  let excludes = config.instrumentation.excludes(true);
  enableHooks();


  ////

  function overrideConfigWith (opts) {
    let overrides = {
      verbose: opts.verbose,
      instrumentation: {
        root: opts.root,
        'default-excludes': opts['default-excludes'],
        excludes: opts.excludes,
        'include-all-sources': opts['include-all-sources'],
        // preload-sources is deprecated
        // TODO(douglasduteil): remove this option
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

  function enableHooks () {
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
      includes: opts.include || config.instrumentation.extensions()
        .map((ext) => '**/*' + ext),
      excludes: excludes
    }, (err, matchFn) => {
      if (err) {
        return processEnding(err);
      }

      prepareCoverage(matchFn);
      runCommandFn();
    });
  }


  function prepareCoverage (matchFn) {
    let coverageVar = `$$cov_${Date.now()}$$`;
    let instrumenter = new Instrumenter({ coverageVariable: coverageVar });
    let transformer = instrumenter.instrumentSync.bind(instrumenter);

    hook.hookRequire(matchFn, transformer, assign({ verbose: opts.verbose }, config.instrumentation.config));

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
      reporter.write(collector, true, processEnding);
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

  function runCommandFn () {
    process.argv = ["node", cmd].concat(cmdArgs);
    if (opts.verbose) {
      console.log('Running: ' + process.argv.join(' '));
    }
    process.env.running_under_istanbul = 1;
    Module.runMain(cmd, null, true);
  }
}

//

function processEnding (err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
}

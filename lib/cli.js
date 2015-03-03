"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

//

var _fs = require("fs");

var existsSync = _fs.existsSync;
var writeFileSync = _fs.writeFileSync;

var path = _interopRequire(require("path"));

var Module = _interopRequire(require("module"));

//

var which = _interopRequire(require("which"));

var mkdirp = _interopRequire(require("mkdirp"));

var partial = _interopRequire(require("lodash.partial"));

var nomnom = _interopRequire(require("nomnom"));

var _istanbul = require("istanbul");

var hook = _istanbul.hook;
var Collector = _istanbul.Collector;
var Reporter = _istanbul.Reporter;
var matcherFor = _istanbul.matcherFor;
var configuration = _istanbul.config;

var Instrumenter = require("./instrumenter").Instrumenter;

//

//

nomnom.command("cover").help("transparently adds coverage information to a node command. Saves coverage.json and reports at the end of execution").option("cmd", {
  required: true,
  position: 1,
  help: "ES6 js files to cover (using babel)"
}).option("config", {
  metavar: "<path-to-config>",
  help: "the configuration file to use, defaults to .istanbul.yml"
}).option("report", {
  "default": "lcv",
  metavar: "<format>",
  list: true,
  help: "report format, defaults to ['lcv']"
}).option("root", {
  metavar: "<path>",
  help: "the root path to look for files to instrument, defaults to ."
}).option("verbose", {
  flag: true,
  abbr: "v",
  help: "verbose mode"
}).callback(coverCmd);

nomnom.nom();

function callback(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  process.exit(0);
}

function coverCmd(opts) {

  var config = overrideConfigWith(opts);
  var reporter = new Reporter(config);

  var cmd = opts.cmd;

  var cmdArgs = opts["--"] || [];

  if (!existsSync(cmd)) {
    try {
      cmd = which.sync(cmd);
    } catch (ex) {
      return callback("Unable to resolve file [" + cmd + "]");
    }
  } else {
    cmd = path.resolve(cmd);
  }

  if (opts.verbose) console.error("Isparta options : \n ", opts);

  var excludes = config.instrumentation.excludes(true);
  enableHooks();

  ////

  function overrideConfigWith(opts) {

    var overrides = {
      verbose: opts.verbose,
      instrumentation: {
        root: opts.root,
        "default-excludes": opts["default-excludes"],
        excludes: opts.x,
        "include-all-sources": opts["include-all-sources"],
        "preload-sources": opts["preload-sources"]
      },
      reporting: {
        reports: opts.report,
        print: opts.print,
        dir: opts.dir
      },
      hooks: {
        "hook-run-in-context": opts["hook-run-in-context"],
        "post-require-hook": opts["post-require-hook"],
        "handle-sigint": opts["handle-sigint"]
      }
    };

    return configuration.loadFile(opts.config, overrides);
  }

  function enableHooks() {
    opts.reportingDir = path.resolve(config.reporting.dir());
    mkdirp.sync(opts.reportingDir);
    reporter.addAll(config.reporting.reports());

    if (config.reporting.print() !== "none") {
      switch (config.reporting.print()) {
        case "detail":
          reporter.add("text");
          break;
        case "both":
          reporter.add("text");
          reporter.add("text-summary");
          break;
        default:
          reporter.add("text-summary");
          break;
      }
    }

    excludes.push(path.relative(process.cwd(), path.join(opts.reportingDir, "**", "*")));

    matcherFor({
      root: config.instrumentation.root() || process.cwd(),
      includes: ["**/*.js"],
      excludes: excludes
    }, function (err, matchFn) {
      if (err) {
        return callback(err);
      }

      prepareCoverage(matchFn);
      runCommandFn();
    });
  }

  function prepareCoverage(matchFn) {
    var coverageVar = "$$cov_" + Date.now() + "$$";
    var instrumenter = new Instrumenter({ coverageVariable: coverageVar });
    var transformer = instrumenter.instrumentSync.bind(instrumenter);

    hook.hookRequire(matchFn, transformer, { verbose: opts.verbose });

    global[coverageVar] = {};

    if (config.hooks.handleSigint()) {
      process.once("SIGINT", process.exit);
    }

    process.once("exit", function () {
      var file = path.resolve(opts.reportingDir, "coverage.json");
      var cov = undefined,
          collector = undefined;

      if (typeof global[coverageVar] === "undefined" || Object.keys(global[coverageVar]).length === 0) {
        console.error("No coverage information was collected, exit without writing coverage information");
        return;
      } else {
        cov = global[coverageVar];
      }

      mkdirp.sync(opts.reportingDir);
      if (config.reporting.print() !== "none") {
        console.error(Array(80 + 1).join("="));
        console.error("Writing coverage object [" + file + "]");
      }
      writeFileSync(file, JSON.stringify(cov), "utf8");
      collector = new Collector();
      collector.add(cov);
      if (config.reporting.print() !== "none") {
        console.error("Writing coverage reports at [" + opts.reportingDir + "]");
        console.error(Array(80 + 1).join("="));
      }
      reporter.write(collector, true, callback);
    });

    if (config.instrumentation.includeAllSources()) {
      matchFn.files.forEach(function (file) {
        if (opts.verbose) {
          console.error("Preload " + file);
        }
        try {
          require(file);
        } catch (ex) {
          if (opts.verbose) {
            console.error("Unable to preload " + file);
          }
          // swallow
        }
      });
    }
  }

  function runCommandFn() {
    process.argv = ["node", cmd].concat(cmdArgs);
    if (opts.verbose) {
      console.log("Running: " + process.argv.join(" "));
    }
    process.env.running_under_istanbul = 1;
    Module.runMain(cmd, null, true);
  }
}
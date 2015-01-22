"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

//

var existsSync = require("fs").existsSync;
var writeFileSync = require("fs").writeFileSync;
var path = _interopRequire(require("path"));

var Module = _interopRequire(require("module"));

//
var which = _interopRequire(require("which"));

var partial = _interopRequire(require("lodash.partial"));

var nomnom = _interopRequire(require("nomnom"));

var hook = require("istanbul").hook;
var Reporter = require("istanbul").Reporter;
var matcherFor = require("istanbul").matcherFor;
var configuration = require("istanbul").config;
var Instrumenter = require("./instrumenter").Instrumenter;


//


//

nomnom.command("cover").help("transparently adds coverage information to a node command. Saves coverage.json and reports at the end of execution").option("cmd", {
  required: true,
  position: 1,
  help: "ES6 js files to cover (using 6to5)"
}).option("config", {
  metavar: "<path-to-config>",
  help: "the configuration file to use, defaults to .istanbul.yml"
}).option("report", {
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
  var overrides = {
    verbose: opts.verbose
  };

  var _config = configuration.loadFile(opts.config, overrides);
  var reporter = new Reporter(_config);

  var cmd = opts.cmd;
  var cmdArgs = opts.cmdArgs;


  if (!existsSync(cmd)) {
    try {
      cmd = which.sync(cmd);
    } catch (ex) {
      return callback("Unable to resolve file [" + cmd + "]");
    }
  } else {
    cmd = path.resolve(cmd);
  }


  function runFn() {
    process.argv = ["node", cmd].concat(cmdArgs);
    if (opts.verbose) {
      console.log("Running: " + process.argv.join(" "));
    }
    process.env.running_under_istanbul = 1;
    Module.runMain(cmd, null, true);
  }

  var excludes = _config.instrumentation.excludes(true);
  var reportingDir = path.resolve(_config.reporting.dir());
  excludes.push(path.relative(process.cwd(), path.join(reportingDir, "**", "*")));

  matcherFor({
    root: _config.instrumentation.root() || process.cwd(),
    includes: ["**/*.js"],
    excludes: excludes
  }, function (err, matchFn) {
    if (err) {
      callback(err);
    }

    var coverageVar = "$$cov_" + Date.now() + "$$";
    var instrumenter = new Instrumenter({ coverageVariable: coverageVar });
    var transformer = instrumenter.instrumentSync.bind(instrumenter);

    hook.hookRequire(matchFn, transformer, { verbose: opts.verbose });

    //initialize the global variable to stop mocha from complaining about leaks
    global[coverageVar] = {};

    // enable passing --handle-sigint to write reports on SIGINT.
    // This allows a user to manually kill a process while
    // still getting the istanbul report.
    if (_config.hooks.handleSigint()) {
      process.once("SIGINT", process.exit);
    }

    process.once("exit", function () {
      var file = path.resolve(reportingDir, "coverage.json");
      var cov = undefined;

      if (typeof global[coverageVar] === "undefined" || Object.keys(global[coverageVar]).length === 0) {
        console.error("No coverage information was collected, exit without writing coverage information");
        return;
      } else {
        cov = global[coverageVar];
      }

      writeFileSync(file, JSON.stringify(cov), "utf8");
    });

    if (_config.instrumentation.preloadSources()) {
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

    runFn();
  });
}
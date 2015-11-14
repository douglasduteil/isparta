//

import {existsSync, statSync} from 'fs';

//

import cover from './commands/cover'
import ArgParser from './ArgParser'

//

ArgParser({
  cover: runCoverCommand
})
  .parse();

//

function runCoverCommand (opts) {
  const files = opts._.slice(1).reduce(function (memo, file) {
    return memo.concat(lookupFile(file) || [])
  }, []);

  opts.include = opts.include.concat(files);
  cover(opts);
}

function lookupFile (path) {
  if (existsSync(path)) {
    let stat = statSync(path);
    if (stat.isFile()) return path;
  }
}

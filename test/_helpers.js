//

import fs from 'fs'
import path from 'path'

const FIXTURES_PATH = path.join(__dirname, 'fixtures');

export function readFile (filename) {
  if (fs.existsSync(filename)) {
    var file = fs.readFileSync(filename, 'utf8').trim();
    file = file.replace(/\r\n/g, '\n');
    return file;
  } else {
    return '';
  }
}

export function getFixturesTest () {
  return fs
    .readdirSync(FIXTURES_PATH)
    .filter((fixtureName) => fixtureName[0] !== '.')
    .map(createFixtureDescription);

  //

  function createFixtureDescription (fixtureName) {
    let [actual, expectedCover] = [
      { filename: 'actual.js', access: readFile },
      { filename: 'expectedCover.js', access: require }
    ]
      .map(({filename, access}) => {
        let relLoc = path.join(fixtureName, filename);
        return {
          loc: relLoc,
          code: access(path.join(FIXTURES_PATH, relLoc)),
          filename: filename
        }
      });


    return { name: fixtureName, actual, expectedCover };
  }

}

//

export function extractCodeExpect (content, location) {
  if (!(content && location)) return '';

  let { start, end } = location;

  return start.line === end.line ?

    extractExpectInLine(content[start.line - 1], location) :

    Array.from(
      new Array(end.line - start.line + 1),
      (x, i) => {
        let lastLine = start.line + i === end.line;
        return extractExpectInLine(
          content[start.line - 1 + i],
          {
            start: { column: !i ? start.column : 0 },
            end: { column: lastLine ? end.column : Infinity }
          }
        );
      }
    ).join('\n');
}

function extractExpectInLine (line = '', { start = { column: 0 }, end = { column: 0 }}) {
  return line.substring(start.column, end.column);
}

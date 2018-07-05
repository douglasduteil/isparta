"use strict";

ONE.foo = function (bar) {
  return baz(bar ? 0 : 1);
};

/* istanbul ignore next */
if (true) {
  var a = 5;
}


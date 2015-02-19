//

var ONE = {};

ONE.foo = function (bar) {
  return baz(bar ? 0 : 1);
};

/* istanbul ignore next */
ONE.bar = function (){};

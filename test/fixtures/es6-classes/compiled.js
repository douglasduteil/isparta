"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

//

var Animal = (function () {
  function Animal() {
    _classCallCheck(this, Animal);
  }

  _prototypeProperties(Animal, {
    getName: {
      value: function getName() {
        return "Animal";
      },
      writable: true,
      configurable: true
    }
  }, {
    sayHi: {
      value: function sayHi() {
        return "Hi, I am a " + this.type() + ".";
      },
      writable: true,
      configurable: true
    },
    sayOther: {
      value: function sayOther() {
        return "WAT?!";
      },
      writable: true,
      configurable: true
    }
  });

  return Animal;
})();

exports.Animal = Animal;
Object.defineProperty(exports, "__esModule", {
  value: true
});


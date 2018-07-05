'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//

var Animal = function () {
  function Animal() {
    _classCallCheck(this, Animal);
  }

  _createClass(Animal, [{
    key: 'sayHi',
    value: function sayHi() {
      return 'Hi, I am a ' + this.type() + '.';
    }
  }, {
    key: 'sayOther',
    value: function sayOther() {
      return 'WAT?!';
    }
  }], [{
    key: 'getName',
    value: function getName() {
      return 'Animal';
    }
  }]);

  return Animal;
}();

exports.Animal = Animal;


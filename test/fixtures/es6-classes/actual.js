//

var Animal = class {
  sayHi() {
    return 'Hi, I am a ' + this.type() + '.';
  }

  sayOther() {
    return 'WAT?!';
  }

  static getName() {
    return 'Animal';
  }
}

export {Animal};

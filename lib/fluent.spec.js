'use strict';
var expect = require('expect.js'),
  fluent = require('./fluent');

describe('fluent()', function () {
  it('should build a simple method with just one segment', function () {
    var appendTest = fluent({appendTest: '*'}, function (value) {
      return value + 'Test';
    });

    expect(appendTest('ok')).to.eql('okTest');
  });
  it('should build a function usable more than once', function () {
    var appendTest = fluent({appendTest: '*'}, function (value) {
      return value + 'Test';
    });

    expect(appendTest(appendTest('ok'))).to.eql('okTestTest');
  });
  it('should let you mix calls for different instances of the same function', function () {
    var first = fluent({first: '*', then: '*'}, function (first, then) {
      return first + then;
    });

    var test1 = first('1');
    var test2 = first('3');

    expect(test1.then('2')).to.eql('12');
    expect(test2.then('4')).to.eql('34');
  });
  it('should build a multi-segment method', function () {
    var append = fluent({append: '*', to: '*'}, function (right, left) {
      return left + right;
    });

    expect(append('passed').to('this ')).to.eql('this passed');
  });
  it('should allow multiple parameters for a segment', function () {
    var appendTest = fluent({appendTest: ['*', '*']}, function (value, value2) {
      return value + value2 + 'Test';
    });

    expect(appendTest('ok', 'sure')).to.eql('oksureTest');
  });
  it('should require at least one segment', function () {
    expect(fluent.bind(undefined, {}, function () {
    })).to.throwException(/At least one segment is required/);
  });
  it('should require a handler parameter', function () {
    expect(fluent.bind(undefined, {_: '*'}, undefined)).to.throwException(/Parameter handler is required/);
  });
  describe('if extending an object', function () {
    it('should add the method to it', function () {
      var someObj = {};

      fluent({newMethod: '*'}, function () {
        return 'ok';
      }, someObj);

      expect(someObj.newMethod()).to.eql('ok');
    });
    it('should not be enumerable', function () {
      var someObj = {};

      fluent({newMethod: '*'}, function () {
        return 'ok';
      }, someObj);

      for (var method in someObj) {
        expect().fail(method + ' was enumerated');
      }
    });
  });
});
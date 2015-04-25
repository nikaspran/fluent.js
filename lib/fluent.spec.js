'use strict';
var expect = require('expect.js'),
  fluent = require('./fluent');

describe('fluent()', function () {
  it('should build a simple method with just one segment', function () {
    var appendTest = fluent({appendTest: '*'}, function (value) {
      return value + 'Test';
    });

    expect(appendTest('ok')).to.eql('okTest_');
  });
  it('should build a multi-segment method', function () {
    var append = fluent({append: '*', to: '*'}, function (right, left) {
      return left + right;
    });

    expect(append('passed').to('this ')).to.eql('this passed');
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
  });
});
# fluent.js [![Build Status](https://travis-ci.org/nikaspran/fluent.js.svg?branch=master)](https://travis-ci.org/nikaspran/fluent.js)

A tiny library for building fluent interfaces in JavaScript

## Installation

```
npm install fluent.js --save
```

## Usage

### Simple functions

```js
var fluent = require('fluent.js');

var insert = fluent({
  insert: '*',
  into: '[]',
  after: '*'
}, function handler(value, array, otherValue) {
  array.splice(array.indexOf(otherValue) + 1, 0, value);
  return array;
});

console.log(insert(2).into([1, 3]).after(1)); //[1, 2, 3]
```

### Extending objects (and prototypes)

```js
var fluent = require('fluent.js');

fluent({
  with: '*',
  after: '*'
}, function handler(value, otherValue) {
  var copy = this.slice(0);		
  copy.splice(copy.indexOf(otherValue) + 1, 0, value);		
  return copy;
}, Array.prototype);

console.log(['this', 'awesome'].with('is').after('this')); //['this', 'is', 'awesome']
```

## TODO

* Argument validation
* ES6 object destructuring
* Simple build for browsers
* ???

## Contributing

Make sure `gulp build` passes, otherwise try to maintain similar code style.

## License

MIT

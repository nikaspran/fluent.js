function oldInsert(value) {
  return {
    into: function (array) {
      return {
        after: function (afterValue) {
          array.splice(array.indexOf(afterValue) + 1, 0, value);
          return array;
        }
      }
    }
  }
}


function dsl(extend) {
  var propertySpec = {}, builder = new Proxy({}, {
    get: function (target, prop, receiver) {
      return prop === '_then' ? _then : function () {
        propertySpec[prop] = Array.from(arguments);
        return builder;
      };
    }
  });

  function setContextProperties(forFn, withContext, args) {
    var argIndex = 0;
    propertySpec[forFn].forEach(function () {
      withContext.push(args[argIndex]);
    });
  }

  function _then(handler) {
    var fnIndex = 0, fns = Object.keys(propertySpec), context = [], thisArg;

    function updateContext() {
      thisArg = extend && fnIndex === 0 ? this : thisArg;
      setContextProperties(fns[fnIndex], context, arguments);
      var next = {}, nextFn = fns[++fnIndex];
      if (nextFn) {
        next[nextFn] = updateContext;
        return next;
      } else {
        return handler.apply(thisArg, context);
      }
    }

    if (extend) {
      extend[fns[0]] = updateContext;
    }

    return updateContext;
  }

  return builder;
}

var insert = dsl().insert('*').into('array').after('*')._then(function (value, array, otherValue) {
  array.splice(array.indexOf(otherValue) + 1, 0, value);
  return array;
});

var result = insert(2).into([1, 3]).after(1);

console.log(result);

dsl(Array.prototype).with('*').after('*')._then(function (value, otherValue) {
  var copy = this.slice(0);
  copy.splice(copy.indexOf(otherValue) + 1, 0, value);
  return copy;
});

var arr = ['this', 'awesome'];
console.log(arr, arr.with('is').after('this'));
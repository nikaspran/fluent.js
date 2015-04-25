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


function fluent(extend, segments, handler) {
  var propertySpec = buildPropertySpec(segments);

  function buildPropertySpec(segments) {
    var propertySpec = {}, segmentKey, parameters;

    for (segmentKey in segments) {
      if (!segments.hasOwnProperty(segmentKey)) {
        return;
      }

      parameters = segments[segmentKey];
      propertySpec[segmentKey] = Array.isArray(parameters) ? parameters : [parameters];
    }

    return propertySpec;
  }

  function setContextProperties(forFn, withContext, args) {
    var argIndex = 0;
    propertySpec[forFn].forEach(function () {
      withContext.push(args[argIndex]);
    });
  }

  function buildFunction(handler) {
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


  return buildFunction(handler);
}

var insert = fluent(undefined, {insert: '*', into: 'array', after: '*'}, function (value, array, otherValue) {
  array.splice(array.indexOf(otherValue) + 1, 0, value);
  return array;
});

var result = insert(2).into([1, 3]).after(1);

console.log(result);

fluent(Array.prototype, {with: '*', after: '*'}, function (value, otherValue) {
  console.log(this);
  var copy = this.slice(0);
  copy.splice(copy.indexOf(otherValue) + 1, 0, value);
  return copy;
});

var arr = ['this', 'awesome'];
console.log(arr, arr.with('is').after('this'));
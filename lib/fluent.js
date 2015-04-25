//'use strict';
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

function fluent(segments, handler, extend) {
  var propertySpec = buildPropertySpec(segments),
    methods = Object.keys(propertySpec);

  if (!methods.length) {
    throw new Error('At least one segment is required');
  }

  if (!handler) {
    throw new Error('Parameter handler is required');
  }

  function updateArgumentsForSegment(segment, withContext, args) {
    var argIndex = 0;
    propertySpec[segment].forEach(function () {
      withContext.push(args[argIndex]);
    });
  }

  function buildFunction(handler) {
    var fnIndex = 0, context = [], thisArg;

    function fluentFn() {
      /*jshint validthis:true */
      thisArg = extend && fnIndex === 0 ? this : thisArg;
      /* jshint validthis:false */
      updateArgumentsForSegment(methods[fnIndex], context, arguments);
      var next = {}, nextFn = methods[++fnIndex];
      if (nextFn) {
        next[nextFn] = fluentFn;
        return next;
      } else {
        return handler.apply(thisArg, context);
      }
    }

    if (extend) {
      extend[methods[0]] = fluentFn;
    }

    return fluentFn;
  }


  return buildFunction(handler);
}

module.exports = fluent;
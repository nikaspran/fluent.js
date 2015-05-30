(function (globalCtx) {
  'use strict';
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
      methods = Object.keys(propertySpec),
      branches;

    if (!methods.length) {
      throw new Error('At least one segment is required');
    }

    if (!handler) {
      throw new Error('Parameter handler is required');
    }

    if (typeof(handler) != 'function') {
      branches = handler;
    } else {
      branches = {};
    }

    function updateArgumentsForSegment(segment, withContext, args) {
      var argIndex = 0;
      propertySpec[segment].forEach(function () {
        if (argIndex < args.length) {
          withContext.push(args[argIndex++]);
        }
      });
    }

    function functionBuilder() {
      /*jshint validthis:true */
      var fnIndex = 0, context = [], thisArg = this;
      /*jshint validthis:false */

      function fluentFn() {
        updateArgumentsForSegment(methods[fnIndex], context, arguments);
        var next = {}, nextFn = methods[++fnIndex];
        if (nextFn) {
          if (branches[nextFn]) {
            for (var branch in branches) {
              next[branch] = branches.hasOwnProperty(branch) ? branches[branch].bind.apply(branches[branch], [thisArg].concat(context)) : undefined;
            }
            return next;
          } else {
            next[nextFn] = fluentFn;
            return next;
          }
        } else {
          return handler.apply(thisArg, context);
        }
      }

      return fluentFn.apply(thisArg, arguments);
    }

    if (extend) {
      Object.defineProperty(extend, methods[0], {
        enumerable: false,
        configurable: true,
        writable: true,
        value: functionBuilder
      });
    }

    return functionBuilder;
  }

  module.exports = fluent;
}(this));

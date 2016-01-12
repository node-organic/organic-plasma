var Plasma = require("organic").Plasma
var util = require("util")
var _ = require("underscore")

var deepEqual = function (actual, expected) {
  if(Array.isArray(actual)) {
    if(actual.length != expected.length)
      return false
    for(var i = 0; i<actual.length; i++)
      if(!deepEqual(actual[i], expected[i]))
        return false
    return true
  }
  else
  if(typeof actual == "object") {
    for(var key in actual)
      if(!deepEqual(actual[key], expected[key]))
        return false
    return true
  } else
    return actual === expected
}

var isFilledArray = function (arr) {
  for(var i = 0; i<arr.length; i++)
    if(arr[i] == undefined || typeof arr[i] == "undefined")
      return false
  return true
}


module.exports = function(){
  this.listeners = []
  this.remoteSubscribers = []
  this.storedChemicals = []
}

util.inherits(module.exports, Plasma)

module.exports.prototype.on = function (pattern, handler, context, once) {
  if(Array.isArray(pattern)) {
    this.onAll(pattern, handler, context, once)
  } else {
    if (typeof pattern == "string")
      pattern = {type: pattern}

    var handlerExecuted = false
    for(var i = 0; i < this.storedChemicals.length; i++) {
      var chemical = this.storedChemicals[i]
      if(deepEqual(pattern, chemical)) {
        handlerExecuted = true
        handler.call(context, chemical)
      }
    }

    if (handlerExecuted && once)
      return

    this.listeners.push({
      pattern: pattern,
      handler: handler,
      context: context,
      once: once
    })
  }
}

module.exports.prototype.onAll = function (patterns, handler, context, once) {
  var chemicalsFound = []
  var createSingleHandler = function(index){
    return function(c){
      chemicalsFound[index] = c
      if(isFilledArray(chemicalsFound) && chemicalsFound.length == patterns.length) {
        handler.apply(context, chemicalsFound)
      }
    }
  }
  for(var i = 0; i<patterns.length; i++) {
    this.on(patterns[i], createSingleHandler(i), context, once)
  }
}

module.exports.prototype.once = function (pattern, handler, context) {
  this.on(pattern, handler, context, true)
}

module.exports.prototype.off = function (pattern, handler) {
  for(var i = 0; i<this.listeners.length; i++) {
    if(deepEqual(this.listeners[i].pattern, pattern) && this.listeners[i].handler == handler) {
      this.listeners.splice(i, 1)
      i -= 1
    }
  }
}

module.exports.prototype.emit = function (chemical, callback) {
  if(typeof chemical == "string")
    chemical = {type: chemical}
  this.emitToRemoteSubscribers(chemical)

  var listenersCount = this.listeners.length
  var promises = []
  for(var i = 0; i<listenersCount && i<this.listeners.length; i++) {
    var listener = this.listeners[i]
    if(deepEqual(listener.pattern, chemical)) {
      if(listener.once) {
        this.listeners.splice(i, 1);
        i -= 1;
        listenersCount -= 1;
      }

      var p
      var handlerCallback = callback
      if (!handlerCallback && listener.handler.length === 2) {
        // requested promise - hitting -> callback feedback mode
        var resolveCallback
        var rejectCallback
        p = new Promise(function (resolve, reject) {
          resolveCallback = resolve
          rejectCallback = reject
        })
        handlerCallback = function (err, result) {
          if (err) return rejectCallback(err)
          resolveCallback(result)
        }
        promises.push(p)
      }

      var aggregated = listener.handler.call(listener.context, chemical, handlerCallback)
      if (aggregated === true) return // halt chemical transfer, it has been aggregated

      if (aggregated instanceof Promise && listener.handler.length === 1 && callback) {
        // requested callback - hitting -> promise feedback mode
        aggregated.then(function (data) {
          callback(null, data)
        }).catch(function (err) {
          callback(err)
        })
      }

      if (aggregated instanceof Promise) {
        promises.push(aggregated)
      }
    }
  }
  if (promises.length === 0) return
  if (promises.length === 1) return promises[0]
  return Promise.all(promises)
}

module.exports.prototype.store = function (chemical, callback) {
  this.storedChemicals.push(chemical)
  this.emit(chemical, callback)
}

module.exports.prototype.trash = function (chemical) {
  for(var i = 0; i < this.storedChemicals.length; i++) {
    if (this.storedChemicals[i] === chemical) {
      this.storedChemicals[i].splice(i, 1)
      i -= 1
    }
  }
}


module.exports.prototype.pipe = function(dest) {
  this.remoteSubscribers.push({
    target: dest
  })
}

module.exports.prototype.unpipe = function(dest) {
  for (var i = 0; i<this.remoteSubscribers.length; i++) {
    if (this.remoteSubscribers[i].target === dest) {
      this.remoteSubscribers.splice(i, 1)
      i -= 1
    }
  }
}

module.exports.prototype.excludeUnseriazableNodes = function(obj) {
  var memo = []
  var result = JSON.parse(JSON.stringify(obj, function(key, value){
    if(value instanceof require("events").EventEmitter)
      return "[EventEmitter "+value+"]"
    else
    if(typeof value == "object" && !Array.isArray(value) && _.contains(memo, value))
      return "[Circular "+value+"]"
    else {
      if(typeof value == "object" && !Array.isArray(value))
        memo.push(value)
      return value
    }
  }))
  return result
}

module.exports.prototype.emitToRemoteSubscribers = function(chemical) {
  for(var i = 0; i<this.remoteSubscribers.length; i++) {
    var s = this.remoteSubscribers[i]
    chemical = _.extend({}, chemical)
    if(s.transformation)
      chemical = s.transformation(chemical)
    if(typeof s.target == "function")
      s.target(this.excludeUnseriazableNodes(chemical))
  }
}

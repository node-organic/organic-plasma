var Plasma = require("organic").Plasma
var util = require("util")
var _ = require("underscore")
var async = require("async")
var noopCallback = function(){}

var deepEqual = function(actual, expected) {
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

module.exports = function(){
  this.listeners = []
  this.remoteSubscribers = []
}

util.inherits(module.exports, Plasma);

/*
  add support 
    * plasma.on(["checmialType1", "chemicalType2"], handler)
    * handler = function(err || chemicalsFound){}
*/
module.exports.prototype.on = function(pattern, handler, context, once) {
  if(Array.isArray(pattern)) {
    var chemicalsFound = []
    var firstFoundError = null
    var multiHandler = function(c){
      if(c instanceof Error && !firstFoundError) firstFoundError = c
      chemicalsFound.push(c)
      if(chemicalsFound.length == pattern.length) {
        handler.call(context, firstFoundError || chemicalsFound)
      }
    }
    for(var i = 0; i<pattern.length; i++)
      this.on(pattern[i], multiHandler, context, once)
  } else {
    this.listeners.push({
      pattern: pattern,
      handler: handler,
      context: context,
      once: once
    })
  }
}

module.exports.prototype.once = function(pattern, handler, context) {
  this.on(pattern, handler, context, true)
}

module.exports.prototype.off = function(pattern, handler) {
  for(var i = 0; i<this.listeners.length; i++) {
    if(deepEqual(this.listeners[i].pattern, pattern) && this.listeners[i].handler == handler) {
      this.listeners.splice(i, 1);
      i -= 1
    }
  }
}

/*
  add support for plasma.emit("chemicalType", {chemicalProperty: value,...})
*/
module.exports.prototype.emit = function(chemical) {
  if(typeof chemical == "string")
    chemical = {type: chemical}
  this.emitToRemoteSubscribers(chemical)

  for(var i = 0; i<this.listeners.length; i++) {
    if(deepEqual(this.listeners[i].pattern, chemical)) {
      var aggregated = this.listeners[i].handler.call(this.listeners[i].context, chemical, noopCallback)
      if(this.listeners[i].once) {
        this.listeners.splice(i, 1);
        i -= 1;
      }
      if(aggregated == true) 
        return
    } else
    if(deepEqual(this.listeners[i].pattern, chemical.type)) {
      var aggregated = this.listeners[i].handler.call(this.listeners[i].context, chemical, noopCallback)
      if(this.listeners[i].once) {
        this.listeners.splice(i, 1);
        i -= 1;
      }
      if(aggregated == true)
        return
    }
  }
}

module.exports.prototype.emitAndCollect = function(chemical, callback) {
  var self = this
  if(typeof chemical == "string")
    chemical = {type: chemical}
  this.emitToRemoteSubscribers(chemical)

  async.each(this.listeners, function(listener, next){
    if(!deepEqual(listener.pattern, chemical)) {
      if(!deepEqual(listener.pattern, chemical.type))
        return next()
    }

    // remove listener from list if added as 'once'
    // hopefully async makes a copy of 'array' arg...
    if(listener.once) {
      self.listeners.splice(i, 1);
      i -= 1;
    }

    // determine listener reaction format as 
    // sync or async base based on number of arguments
    
    if(listener.handler.length == 2) { // async
      listener.handler.call(listener.context, chemical, next)
    } else { // sync
      listener.handler.call(listener.context, chemical)
      next()
    }
  }, callback)
}

module.exports.prototype.pipe = function(dest) {
  this.remoteSubscribers.push({
    target: dest
  })
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
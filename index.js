var Plasma = require('organic').Plasma
var utils = require('./lib/utils')

var Plasma = module.exports = function(opts){
  this.listeners = []
  this.remoteSubscribers = []
  this.storedChemicals = []
  this.utils = utils
  this.opts = opts || {missingHandlersChemical: false}
}

module.exports.prototype = Object.create(Plasma.prototype)
module.exports.constructor = Plasma

module.exports.prototype.on = function (pattern, handler, context, once) {
  if(Array.isArray(pattern)) {
    this._onAll(pattern, handler, context, once)
  } else {
    if (typeof pattern == "string") {
      pattern = {type: pattern}
    }

    var handlerExecuted = false
    for(var i = 0; i < this.storedChemicals.length; i++) {
      var chemical = this.storedChemicals[i]
      if(this.utils.deepEqual(pattern, chemical)) {
        handlerExecuted = true
        handler.call(context, chemical)
      }
    }

    if (handlerExecuted && once)
      return

    this.listeners.push({
      pattern: pattern,
      handler: handler,
      once: once,
      context: context
    })
  }
}

module.exports.prototype._onAll = function (patterns, handler, context, once) {
  var self = this
  var chemicalsFound = []
  var createSingleHandler = function(index){
    return function(c){
      chemicalsFound[index] = c
      if(self.utils.isFilledArray(chemicalsFound) && chemicalsFound.length == patterns.length) {
        handler.apply(context, chemicalsFound)
      }
    }
  }
  for(var i = 0; i<patterns.length; i++) {
    this.on(patterns[i], createSingleHandler(i),  once)
  }
}

module.exports.prototype.once = function (pattern, handler, context) {
  this.on(pattern, handler, context, true)
}

module.exports.prototype.off = function (pattern, handler) {
  if (pattern && handler) {
    if (typeof pattern == "string") {
      pattern = {type: pattern}
    }
    for(var i = 0; i<this.listeners.length; i++) {
      if(this.utils.deepEqual(this.listeners[i].pattern, pattern) && this.listeners[i].handler == handler) {
        this.listeners.splice(i, 1)
        i -= 1
      }
    }
  } else
  if (typeof pattern === 'function') {
    for(var i = 0; i<this.listeners.length; i++) {
      if(this.listeners[i].handler == pattern) {
        this.listeners.splice(i, 1)
        i -= 1
      }
    }
  }
}

module.exports.prototype.store = function (chemical) {
  if (typeof chemical == "string") {
    chemical = {type: chemical}
  }
  this.storedChemicals.push(chemical)
  return this.emit(chemical)
}

module.exports.prototype.storeAndOverride = function (chemical) {
  if (this.has({type: chemical.type})) {
    this.trashAll({type: chemical.type})
  }
  this.storedChemicals.push(chemical)
  return this.emit(chemical)
}

module.exports.prototype.has = function (pattern) {
  for(var i = 0; i < this.storedChemicals.length; i++) {
    var chemical = this.storedChemicals[i]
    if (this.utils.deepEqual(pattern, chemical)) {
      return true
    }
  }
  return false
}

module.exports.prototype.get = function (pattern) {
  for(var i = 0; i < this.storedChemicals.length; i++) {
    var chemical = this.storedChemicals[i]
    if (this.utils.deepEqual(pattern, chemical)) {
      return chemical
    }
  }
}

module.exports.prototype.getAll = function (pattern) {
  var result = []
  for(var i = 0; i < this.storedChemicals.length; i++) {
    var chemical = this.storedChemicals[i]
    if (this.utils.deepEqual(pattern, chemical)) {
      result.push(chemical)
    }
  }
  return result
}


module.exports.prototype.trash = function (chemical) {
  for(var i = 0; i < this.storedChemicals.length; i++) {
    if (this.storedChemicals[i] === chemical) {
      this.storedChemicals.splice(i, 1)
      i -= 1
    }
  }
}

module.exports.prototype.trashAll = function (pattern) {
  for(var i = 0; i < this.storedChemicals.length; i++) {
    if (this.utils.deepEqual(pattern, this.storedChemicals[i])) {
      this.storedChemicals.splice(i, 1)
      i -= 1
    }
  }
}

module.exports.prototype.pipe = function (dest) {
  this.remoteSubscribers.push({
    target: dest
  })
}

module.exports.prototype.unpipe = function (dest) {
  for (var i = 0; i<this.remoteSubscribers.length; i++) {
    if (this.remoteSubscribers[i].target === dest) {
      this.remoteSubscribers.splice(i, 1)
      i -= 1
    }
  }
}

module.exports.prototype.notifySubscribers = function (chemical) {
  for(var i = 0; i<this.remoteSubscribers.length; i++) {
    var s = this.remoteSubscribers[i]
    var r = {}
    for (var key in chemical)
      r[key] = chemical[key]
    s.target(chemical)
  }
}

module.exports.prototype.emit = function (chemical, callback) {
  if (typeof chemical == "string") {
    chemical = {type: chemical}
  }

  this.notifySubscribers(chemical)

  var listenersCount = this.listeners.length
  var hasListeners = false
  for(var i = 0; i<listenersCount && i<this.listeners.length; i++) {
    var listener = this.listeners[i]
    if(this.utils.deepEqual(listener.pattern, chemical)) {
      hasListeners = true
      if(listener.once) {
        this.listeners.splice(i, 1);
        i -= 1;
        listenersCount -= 1;
      }

      var aggregated = listener.handler.call(listener.context, chemical, callback || function noop () {})
      if (aggregated === true) return true // halt chemical transfer, it has been aggregated
    }
  }

  if (this.opts.missingHandlersChemical && !hasListeners && chemical.type !== this.opts.missingHandlersChemical) {
    this.emit({
      type: this.opts.missingHandlersChemical,
      chemical: chemical
    })
  }
}

var Plasma = require('organic').Plasma
var utils = require('./lib/utils')

var Plasma = module.exports = function(){
  this.listeners = []
  this.remoteSubscribers = []
  this.storedChemicals = []
  this.utils = utils
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

module.exports.prototype.off = function (pattern, handler, context) {
  if (typeof pattern !== 'function') {
    if (typeof pattern == "string") {
      pattern = {type: pattern}
    }
    for(var i = 0; i<this.listeners.length; i++) {
      if(this.utils.deepEqual(this.listeners[i].pattern, pattern) &&
        this.listeners[i].handler === handler &&
        this.listeners[i].context === context) {
        this.listeners.splice(i, 1)
        i -= 1
      }
    }
  } else
  if (typeof pattern === 'function') {
    for(var i = 0; i<this.listeners.length; i++) {
      if(this.listeners[i].handler === pattern && this.listeners[i].context === handler) {
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
  for(let i = 0; i<this.remoteSubscribers.length; i++) {
    let s = this.remoteSubscribers[i]
    let r = {}
    for (let key in chemical) {
      r[key] = chemical[key]
    }
    s.target(chemical)
  }
}

module.exports.prototype.emitOnce = async function (chemical) {
  if (typeof chemical == "string") {
    chemical = { type: chemical }
  }

  this.notifySubscribers(chemical)

  let listenersCount = this.listeners.length
  let collectedResult = null
  let collectedError = null
  for (let i = 0; i < listenersCount && i < this.listeners.length; i++) {
    let listener = this.listeners[i]
    if (this.utils.deepEqual(listener.pattern, chemical)) {
      if (listener.once) {
        this.listeners.splice(i, 1);
        i -= 1;
        listenersCount -= 1;
      }

      try {
        if (listener.handler.length === 2) {
          return new Promise((resolve, reject) => {
            listener.handler.call(listener.context, chemical, (err, data) => {
              if (err) {
                reject(err)
              } else {
                resolve(data)
              }
            })
          })
        } else {
          return listener.handler.call(listener.context, chemical)
        }
      } catch (e) {
        return e
      }
    }
  }
}

module.exports.prototype.emit = async function (chemical, callback) {
  if (typeof chemical == "string") {
    chemical = {type: chemical}
  }

  this.notifySubscribers(chemical)

  let listenersCount = this.listeners.length
  let collectedResults = []
  let collectedErrors = []
  let matchedCount = -1
  for(let i = 0; i<listenersCount && i<this.listeners.length; i++) {
    let listener = this.listeners[i]
    if(this.utils.deepEqual(listener.pattern, chemical)) {
      matchedCount += 1
      if(listener.once) {
        this.listeners.splice(i, 1);
        i -= 1;
        listenersCount -= 1;
      }
      try {
        let result
        if (listener.handler.length === 2) {
          result = await (new Promise(function (resolve, reject) {
            // handler is in accepting arguments: chemical & callback
            listener.handler.call(listener.context, chemical, (err, data) => {
              if (err) {
                reject(err)
              } else {
                resolve(data)
              }
            })
          }))
        } else {
          result = await listener.handler.call(listener.context, chemical)
        }
        collectedResults[matchedCount] = result
      } catch (e) {
        collectedErrors[matchedCount] = e
      }
    }
  }

  if (callback) {
    if (collectedErrors.length > 0) {
      return callback(collectedErrors)
    } else {
      return callback(null, collectedResults)
    }
  }
  if (collectedErrors.length > 0) {
    throw collectedErrors
  }
  return collectedResults
}
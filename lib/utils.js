var _ = require("underscore")

var deepEqual = module.exports.deepEqual = function (actual, expected) {
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

module.exports.isFilledArray = function (arr) {
  for(var i = 0; i<arr.length; i++)
    if(arr[i] == undefined || typeof arr[i] == "undefined")
      return false
  return true
}

module.exports.excludeUnseriazableNodes = function(obj) {
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

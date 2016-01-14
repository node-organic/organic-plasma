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

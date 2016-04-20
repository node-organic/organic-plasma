var deepEqual = module.exports.deepEqual = function (pattern, chemical) {
  if(Array.isArray(pattern)) {
    if(pattern.length != chemical.length)
      return false
    for(var i = 0; i<pattern.length; i++)
      if(!deepEqual(pattern[i], chemical[i]))
        return false
    return true
  }
  else
  if(typeof pattern == "object") {
    for(var key in pattern)
      if(!deepEqual(pattern[key], chemical[key]))
        return false
    return true
  } else
    return pattern === chemical
}

module.exports.isFilledArray = function (arr) {
  for(var i = 0; i<arr.length; i++)
    if(arr[i] == undefined || typeof arr[i] == "undefined")
      return false
  return true
}

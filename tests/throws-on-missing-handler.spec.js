describe("plasma throws on missing handler", function(){
  var Plasma = require("../index")
  var instance  = new Plasma({
    throwOnMissingHandler: true
  })
  it("throws", function () {
    try {
      instance.emit('c1')
    } catch (err) {
      expect(err).toBeDefined()
      return
    }
    throw new Error('shouldnt reach here')
  })
  it("doesnt throws on store", function () {
    try {
      instance.store('c1')
    } catch (err) {
      throw err
    }
    expect(instance.get({type:'c1'})).toBeDefined()
  })
})

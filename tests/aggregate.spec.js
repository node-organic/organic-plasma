describe("plasma aggregate feature", function(){
  var Plasma = require("../index")
  var instance  = new Plasma()
  it("aggregate chemical", function(){
    instance.on('c1', function (c) {
      expect(c.type).toBe('c1')
      return true
    })
    instance.on('c1', function () {
      throw new Error('should be called')
    })
    expect(instance.emit({type: "c1"})).toBe(true)
  })
})

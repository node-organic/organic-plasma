describe("plasma has feature", function(){
  var Plasma = require("../index")
  var instance  = new Plasma()
  it("stores and has chemical", function(){
    instance.store({type: "c1"})
    expect(instance.has({type: "c1"})).toBe(true)
    expect(instance.has({type: "c2"})).toBe(false)
  })

})

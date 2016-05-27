describe("plasma has feature", function(){
  var Plasma = require("../index")
  var instance  = new Plasma()
  it("stores and has chemical", function(){
    instance.store({type: "c1"})
    exect(instance.has({type: "c1"})).to.eq(true)
    exect(instance.has({type: "c2"})).to.eq(false)
  })

})

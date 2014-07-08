describe("plasma emitAndCollect feature", function(){
  var Plasma = require("../index")
  var instance  = new Plasma()
  it("returns results in pattern order even when chemicals are in different order", function(done){
    instance.once("c1", function onceHandler(){})
    instance.on("c1", function anotherHandler(){})
    expect(instance.listeners.length).toBe(2)
    instance.emitAndCollect({type: "c1"}, function(){
      expect(instance.listeners.length).toBe(1)
      done()
    })
  })
  
})
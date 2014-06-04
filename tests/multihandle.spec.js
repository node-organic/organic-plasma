describe("plasma multihandle feature", function(){
  var Plasma = require("../index")
  var instance  = new Plasma()
  it("returns results in pattern order even when chemicals are in different order", function(){
    instance.on(["c1", "c2", "c3"], function(results){
      expect(results[0].type).toBe("c1")
      expect(results[1].type).toBe("c2")
      expect(results[2].type).toBe("c3")
    })
    instance.emit({type: "c3"})
    instance.emit({type: "c1"})
    instance.emit({type: "c2"})
  })
  
})
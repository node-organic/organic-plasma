describe("plasma multihandle feature", function(){
  var Plasma = require("../index")
  it("returns results in pattern order even when chemicals are in different order", function(){
    var instance  = new Plasma()
    instance.on(["c1", "c2", "c3"], function(result1, result2, result3){
      expect(result1.type).toBe("c1")
      expect(result2.type).toBe("c2")
      expect(result3.type).toBe("c3")
    })
    instance.emit({type: "c3"})
    instance.emit({type: "c1"})
    instance.emit({type: "c2"})
  })
})

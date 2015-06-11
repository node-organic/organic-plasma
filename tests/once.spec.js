describe("plasma once feature", function(){
  var Plasma = require("../index")
  var instance  = new Plasma()
  it("returns results in pattern order even when chemicals are in different order", function(done){
    instance.once("c1", function(c){
      expect(c.type).toBe("c1")
      instance.once("c1", function(c){
        expect(c.type).toBe("c1")
        done()
      })
      instance.emit({type: "c1"})
    })
    instance.emit({type: "c1"})
  })
  
})
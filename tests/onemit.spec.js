describe("plasma on / emit feature", function(){
  var Plasma = require("../index")

  it("works", function(done){
    var instance  = new Plasma()
    instance.on("c1", function(c){
      expect(c.type).toBe("c1")
      done()
    })
    instance.emit({type: "c1"})
  })
})

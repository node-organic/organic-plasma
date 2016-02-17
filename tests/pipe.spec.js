describe("plasma pipe feature", function(){
  var Plasma = require("../index")
  var instance  = new Plasma()
  it("pipes all chemicals to destination Fn", function(done){
    instance.pipe(function(c){
      expect(c.type).toBe("c1")
      done()
    })
    instance.emit({type: "c1"})
  })
})

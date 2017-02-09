describe("plasma pipe feature", function(){
  var Plasma = require("../index")
  var instance  = new Plasma()
  it("pipes all chemicals to destination Fn", function(done){
    var pipeHit = false
    instance.pipe(function(c){
      expect(c.type).toBe("c1")
      pipeHit = true
    })
    instance.on("c1", function () {
      expect(pipeHit).toBe(true)
      done()
    })
    instance.emit({type: "c1"})
  })
})

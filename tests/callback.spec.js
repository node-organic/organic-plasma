describe("plasma emits and always callbacks", function(){
  var Plasma = require("../index")
  var instance  = new Plasma()
  it("emits and callbacks", function (done) {
    instance.on('c1', function (c) {
      expect(c.type).toBe('c1')
    })
    instance.emit({type: "c1"}, function () {
      done()
    })
  })
})

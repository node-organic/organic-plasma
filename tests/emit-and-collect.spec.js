describe("plasma emit and collect feature", function(){
  var Plasma = require("../index")
  var instance  = new Plasma()
  it("emit and collect", function () {
    instance.on('c1', function (c, callback) {
      expect(c.type).toBe('c1')
      callback()
    })
    instance.on('c1', function (c, callback) {
      expect(c.type).toBe('c1')
      callback()
    })
    instance.emitAndCollect({type: "c1"}, function (results) {
      expect(results.length).toBe(2)
    })
  })
})

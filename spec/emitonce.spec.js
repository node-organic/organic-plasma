describe("plasma emit once feature", function () {
  var Plasma = require("../index")

  it("works", function (done) {
    var instance = new Plasma()
    instance.on("c1", function (c) {
      expect(c.type).toBe("c1")
      done()
    })
    instance.on("c1", function (c) {
      done(new Error('should not reach here'))
    })
    instance.emitOnce({ type: "c1" })
  })
})

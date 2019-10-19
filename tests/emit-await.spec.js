describe("plasma emit await", function () {
  var Plasma = require("../index")
  var instance  = new Plasma()
  it("emit await", async function () {
    instance.on('c1', function (c, callback) {
      expect(c.type).toBe('c1')
      callback()
    })
    instance.on('c1', function (c, callback) {
      expect(c.type).toBe('c1')
      callback()
    })
    let results = await instance.emit({type: "c1"})
    expect(results.length).toBe(1)
  })
  it("emit await with callback error as exception", async function () {
    instance.on('c1', function (c, callback) {
      callback(new Error('custom'))
    })
    try {
      let results = await instance.emit({type: "c1"})
      expect(results.length).toBe(1)
    } catch (err) {
      expect(err).toBeDefined()
      expect(err.message).toBe('custom')
    }
  })
  it("emit await with reaction exception", async function () {
    instance.on('c1', function (c) {
      new Error('custom')
    })
    try {
      let results = await instance.emit({type: "c1"})
      expect(results.length).toBe(1)
    } catch (err) {
      expect(err).toBeDefined()
      expect(err.message).toBe('custom')
    }
  })
})

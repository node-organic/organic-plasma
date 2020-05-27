describe("plasma emit await", function () {
  var Plasma = require("../index")
  it("emit await", async function () {
    var instance  = new Plasma()
    instance.on('c1', function (c, callback) {
      expect(c.type).toBe('c1')
      callback(null, 1)
    })
    instance.on('c1', function (c, callback) {
      expect(c.type).toBe('c1')
      callback(null, 2)
    })
    let results = await instance.emit({type: "c1"})
    expect(results.length).toBe(2)
    expect(results[0]).toBe(1)
    expect(results[1]).toBe(2)
  })
  it("emit await with callback error as exception", async function () {
    var instance = new Plasma()
    instance.on('c1', function (c, callback) {
      callback(new Error('custom'))
    })
    try {
      let results = await instance.emit({type: "c1"})
      expect(results.length).toBe(0)
    } catch (err) {
      expect(err).toBeDefined()
      expect(err[0].message).toBe('custom')
    }
  })
  it("emit await with reaction exception", async function () {
    var instance = new Plasma()
    instance.on('c1', function (c) {
      throw new Error('custom')
    })
    try {
      let results = await instance.emit({type: "c1"})
      expect(results.length).toBe(0)
    } catch (err) {
      expect(err).toBeDefined()
      expect(err[0].message).toBe('custom')
    }
  })
  it("emit await couple", async function () {
    var instance = new Plasma()
    instance.on('c1', function (c) {
      
    })
    instance.on('c1', function (c) {

    })
    let results = await instance.emit({ type: "c1" })
    expect(results.length).toBe(2)
  })

  it("emit await positioning", async function () {
    var instance = new Plasma()
    instance.on('c1', function (c) {
      return 1
    })
    instance.on('c1', function (c) {
      return 5
    })
    instance.on('c1', function (c) {
      return 2
    })
    let results = await instance.emit({ type: "c1" })
    expect(results.length).toBe(3)
    expect(results).toEqual([1, 5, 2])
  })

  it("emit await positioning of errors", async function () {
    var instance = new Plasma()
    instance.on('c1', function (c) {
      return 1
    })
    instance.on('c1', function (c) {
      throw 3
    })
    instance.on('c1', function (c) {
      return 2
    })
    try {
      let results = await instance.emit({ type: "c1" })
    } catch (e) {
      expect(e.length).toBe(2)
      expect(e).toEqual([undefined, 3])
    }
  })
})

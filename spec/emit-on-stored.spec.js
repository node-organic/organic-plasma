describe("plasma emit on stored chemicals", function(){
  var Plasma = require("../index")
  var instance  = new Plasma()

  it("stores and emits", function(){
    var emitOnStored = false
    var chemical = {type: "storedChemical"}
    instance.store(chemical)

    instance.on("storedChemical", function (c) {
      expect(c.type).toBe("storedChemical")
      emitOnStored = true
    })

    expect(instance.has(chemical)).toBe(true)
    expect(emitOnStored).toBe(true)
  })
})

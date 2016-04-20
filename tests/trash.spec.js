describe("plasma trash feature", function(){
  var Plasma = require("../index")
  var instance  = new Plasma()
  it("stores and trash", function(){
    var chemical = {type: "c1"}
    instance.store(chemical)
    expect(instance.has(chemical)).toBe(true)
    instance.trash(chemical)
    expect(instance.has(chemical)).toBe(false)
  })

  it("stores and trash all", function(){
    var chemical = {type: "c1", property: 1}
    var chemical2 = {type: "c2", property: 1}
    instance.store(chemical)
    expect(instance.has({property: 1})).toBe(true)
    instance.trashAll(chemical)
    expect(instance.has({property: 1})).toBe(false)
  })

})

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

  it("'emit' with missing 'on' results in emiting a warning chemical", function(done){
    var instance  = new Plasma()
    instance.on("plasma/missingHandler", function(c){
      expect(c.type).toBe("plasma/missingHandler")
      expect(c.chemical).toEqual({
        type: "c2",
        someData: true
      })
      done()
    })
    instance.emit({
      type: "c2",
      someData: true
    })
  })

  it("customizing the missing handler warning chemical type", function(done){
    var opts = {
      missingHandlersChemical: "plasma/customWarningChemical"
    }
    var instance  = new Plasma(opts)

    instance.on(opts.missingHandlersChemical, function(c){
      expect(c.type).toBe(opts.missingHandlersChemical)
      expect(c.chemical).toEqual({
        type: "c2",
        someData: true
      })
      done()
    })

    instance.emit({
      type: "c2",
      someData: true
    })
  })
})

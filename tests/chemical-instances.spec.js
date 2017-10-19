describe("chemical as instances", function(){
  var Plasma = require("../index")
  var instance  = new Plasma()
  var Class1 = function (data) {
    this.data = data
  }
  it("matches by chemical isntance class types", function(done){
    instance.on(Class1, function(c){
      expect(c.data.test).toBe(1)
      done()
    })
    instance.emit(new Class1({test: 1}))
  })

})

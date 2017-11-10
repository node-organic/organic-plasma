describe('maintain class method context on all chemicals', function(){
  var Plasma = require("../index")
  it("invokes class method via onAll and keeps its context binded", function(done){
    var instance  = new Plasma()
    var Class1 = function () {
      this.value = true
    }
    Class1.prototype.handleAllMethod = function (c1, c2) {
      expect(c1.type).toBe('c1')
      expect(c2.type).toBe('c2')
      expect(this.value).toBe(true)
      done()
    }
    var classInstance = new Class1()
    instance.on(['c1', 'c2'], classInstance.handleAllMethod, classInstance)
    instance.emit('c1')
    instance.emit('c2')
  })

  it('invokes class method via on and keeps its context binded', function(done) {
    var instance  = new Plasma()
    var Class2 = function () {
      this.value = true
    }
    Class2.prototype.handlerMethod = function (c1) {
      expect(c1.type).toBe('c1')
      expect(this.value).toBe(true)
      done()
    }
    var classInstance = new Class2()
    instance.on('c1', classInstance.handlerMethod, classInstance)
    instance.emit('c1')
  })

  it('invokes a method with proper context after store', function (done) {
    var instance  = new Plasma()
    var Class3 = function () {
      this.value = true
    }
    Class3.prototype.handlerMethod = function (c1) {
      expect(c1.type).toBe('c1')
      expect(this.value).toBe(true)
      done()
    }
    var classInstance = new Class3()
    instance.store('c1')
    instance.on('c1', classInstance.handlerMethod, classInstance)
  })
})

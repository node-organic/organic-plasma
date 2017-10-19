describe('maintain class method context on all chemicals', function(){
  var Plasma = require("../index")
  it("invokes class method via onAll and keeps its context binded", function(done){
    var instance  = new Plasma()
    var Class1 = function (plasma) {
      plasma.on(['c1', 'c2'], this.handleAllMethod.bind(this))
    }
    Class1.prototype.handleAllMethod = function (c1, c2) {
      expect(c1.type).toBe('c1')
      expect(c2.type).toBe('c2')
      expect(this).toBe(classInstance)
      done()
    }
    var classInstance = new Class1(instance)
    instance.emit('c1')
    instance.emit('c2')
  })

  it('invokes class method via on and keeps its context binded', function(done) {
    var instance  = new Plasma()
    var Class2 = function (plasma) {
      plasma.on('c1', this.handlerMethod.bind(this))
    }
    Class2.prototype.handlerMethod = function (c1) {
      expect(c1.type).toBe('c1')
      expect(this).toBe(classInstance)
      done()
    }
    var classInstance = new Class2(instance)
    instance.emit('c1')
  })
})

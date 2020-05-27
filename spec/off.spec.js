describe("plasma off", function () {
  var Plasma = require("../index")
  var instance  = new Plasma()
  var handler = function () {
    throw new Error('should not happen')
  }
  var handler2 = function () {
    throw new Error('should not happen')
  }
  var Context = function () {}
  Context.prototype.handler = function () {
    throw new Error('should not happen')
  }
  it("unregister listener", function () {
    instance.on('c1', handler)
    expect(instance.listeners.length).toBe(1)
    instance.off('c1', handler)
    expect(instance.listeners.length).toBe(0)
    instance.emit('c1')
  })
  it('unregister listener by handler only', function () {
    instance.on('c1', handler)
    instance.on('c1', handler)
    expect(instance.listeners.length).toBe(2)
    instance.off(handler)
    expect(instance.listeners.length).toBe(0)
    instance.emit('c1')
  })
  it('unregister listener by different handlers', function () {
    instance.on('c1', handler)
    instance.on('c1', handler2)
    expect(instance.listeners.length).toBe(2)
    instance.off(handler)
    expect(instance.listeners.length).toBe(1)
    instance.off(handler2)
    expect(instance.listeners.length).toBe(0)
  })
  it('unregister listener by handler and context', function () {
    var context1 = new Context()
    var context2 = new Context()
    instance.on('c1', context1.handler, context1)
    instance.on('c1', context2.handler, context2)
    expect(instance.listeners.length).toBe(2)
    instance.off(context1.handler, context1)
    expect(instance.listeners.length).toBe(1)
    instance.off(context2.handler, context2)
    expect(instance.listeners.length).toBe(0)
  })

  it('unregister listener by pattern and handler', function () {
    var context1 = new Context()
    var context2 = new Context()
    instance.on('c1', context1.handler, context1)
    instance.on('c1', context2.handler, context2)
    expect(instance.listeners.length).toBe(2)
    /instance.off('c1', context1.handler, context1)
    expect(instance.listeners.length).toBe(1)
    instance.off('c1', context2.handler, context2)
    expect(instance.listeners.length).toBe(0)
  })
})

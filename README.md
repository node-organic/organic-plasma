# Plasma v1.1.0

Implementation of [node-organic/Plasma v1.0.0](https://github.com/VarnaLab/node-organic/blob/master/docs/Plasma.md).

## Public API

### plasma.emit(c)

Immediatelly triggers any reactions matching given `c` chemical.

___arguments___
* `c` - Emitted chemical
  * as `String` equals to `{ type: String, ... }` Chemical
  * as `Object` equals to Chemical

### plasma.store(c)

Does the same as `plasma.emit` but also triggers any
reactions registered in the future using `plasma.on`

### plasma.storeAndOverride(c)

Does the same as `plasma.emit` but also triggers any
reactions registered in the future using `plasma.on`.

It overrides previously stored chemicals having the same chemical using `c.type`

### plasma.has(pattern) : boolean

Checks synchroniously for stored chemicals by given pattern.

### plasma.get(pattern) : Chemical

Returns synchroniously first found stored chemical by given pattern.

### plasma.getAll(pattern) : Array [ Chemical ]

Returns synchroniously stored chemicals by given pattern.

### plasma.on(pattern, function (c){} [, context])

Registers a function to be triggered when chemical emitted in plasma matches given pattern.

___arguments___
* `pattern` - matches emitted chemicals
  * as `String` matching `Chemical.type` property
  * as `Object` matching one or many properties of `Chemical`
* `c` - `Object` Chemical matching `pattern`
* `context` *optional* - will be used to invoke for function's context

### plasma.once(pattern, function (c){} [, context])

The same as `plasma.on(pattern, function reaction (c){})` but will trigger the function only once.

### plasma.on([p1, p2, ...], function (c1, c2, ...){} [, context])

Registers a function to be triggered when all chemicals emitted in plasma have been matched.

___arguments___
* `p` - array
  * having elements `String` matching `Chemical.type` property
  * having elements `Object` matching one or many properties of `Chemical`
* `c` - array
  * `Object` Chemicals matching `p` array maintaining their index order
* `context` *optional* - will be used to invoke for function's context

### plasma.once([p1, p2], function (c1, c2) {} [, context])

The same as `plasma.on([p1, p2], function(c1, c2){})` but will trigger the function only once.

### plasma.off(pattern, function)

Unregisters chemical reaction functions, the opposite of `plasma.on` or `plasma.once`.

### plasma.trash(c)

Removes previously stored chemical via `plasma.store`. It does removal by reference and won't throw exception if given chemical is not found in plasma's store.

### plasma.trashAll(pattern)

Removes previously stored chemicals via `plasma.store`. It does removal by chemical pattern

### plasma.pipe(function(c){})

Method which will invoke function per any chemical been emitted or stored in plasma.

### plasma.unpipe(function(c){})

Stops invoking given function previously used for `plasma.pipe`

## Features

Current implementation of organic plasma interface has the following addon features designed for ease in daily development process.

### chemical aggregation

```
plasma.on('c1', function reaction1 () {
  return true
})
plasma.on('c1', function reaction2 () {
  // won't be reached, reaction1 aggregated the chemical
})
plasma.emit('c1')
```

### optional usage of arguments

Invoking **either**:

* `plasma.emit('ready')`
* `plasma.emit({type: 'ready'})`

triggers **all** the following:

* `plasma.on('ready', function(c){ c.type === 'ready' })`
* `plasma.on({type: 'ready'}, function(c){ c.type === 'ready' })`

### feedback support

* [organic-plasma-feedback](https://github.com/outbounder/organic-plasma-feedback)

### custom pattern <-> chemical match algoritms

* override `plasma.utils.deepEqual(pattern, chemical)`

### match chemicals using class definitions as pattern

```
var Class1 = function () {}
plasma.on(Class1, function (instance) {

})
var instance = new Class1()
plasma.emit(instance)
```

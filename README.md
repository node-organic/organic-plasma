# Plasma v1.0.0

Implementation of [node-organic/Plasma v1.0.0](https://github.com/VarnaLab/node-organic/blob/master/docs/Plasma.md).

# API

## `plasma.emit(c)`

Immediatelly triggers any reactions matching given `c` chemical.

### `c` argument

* as `String` equals to `{ type: String, ... }` Chemical
* as `Object` equals to Chemical

## `plasma.store(c)`

Does the same as `plasma.emit` but also triggers any
reactions registered in the future using `plasma.on`

## `plasma.on(pattern, function(c){})`

Registers a function to be triggered when chemical emitted in plasma matches given pattern.

### `pattern` argument

* as `Object` matching one or many properties of `Chemical`
* as `String` matching `Chemical.type` property

### `c` argument

* `Object` Chemical matching `pattern`

## `plasma.once(pattern, function(c1){})`

The same as `plasma.on(pattern, function(c){})` but will trigger the function only once.

## `plasma.on([pattern1, pattern2], function(c1, c2){})`

Registers a function to be triggered when all chemicals emitted in plasma have been matched.

### `pattern` arguments

* as `Object` matching one or many properties of `Chemical`
* as `String` matching `Chemical.type` property

### `c` arguments

* `Object` Chemical matching `pattern` args maintaining their index order

## `plasma.once([pattern1, pattern2], function(c1, c2){})`

The same as `plasma.on([pattern1, pattern2], function(c1, c2){})` but will trigger the function only once.

## `plasma.off(pattern, function)`

Unregisteres previously registered chemical reaction functions via `plasma.on` or `plasma.once`

## `plasma.trash(c)`

Removes previously stored chemical via `plasma.store`. It does removal by reference and won't throw exception if given chemical is not found in plasma's store.

## `plasma.pipe(function(c){})`

Method which will invoke function per any chemical been emitted or stored in plasma.

## `plasma.unpipe(function(c){})`

Stops invoking given function previously used as argument of `plasma.pipe`

# Features

Current implementation of organic plasma interface has the following addon features designed for ease in daily development process.

## chemical aggregation

```
plasma.on('c1', function reaction1 () {
  return true
})
plasma.on('c1', function reaction2 () {
  // won't be reached, reaction1 aggregated the chemical
})
plasma.emit('c1')
```

## optional usage of arguments

Invoking **either**:

* `plasma.emit('ready')`
* `plasma.emit({type: 'ready'})`

triggers **all** the following:

* `plasma.on('ready', function(c){ c.type === 'ready' })`
* `plasma.on({type: 'ready'}, function(c){ c.type === 'ready' })`

## feedback support

The modes are supported separately or mixed.

### Promises mode

```
plasma.pipe(function (c) {})

plasma.on(pattern, function (c) {
  return Promise
})
plasma.once(pattern, function (c) {
  return Promise
})

plasma.on([pattern1, pattern2], function (c1, c2) {
  return Promise
})
plasma.once([pattern1, pattern2], function (c1, c2) {
  return Promise
})

plasma.emit(c)
  .then(function (data) {})
  .catch(function (err) {})

plasma.store(c)
  .then(function (data) {})
  .catch(function (err) {})
```

### Callbacks mode

```
plasma.pipe(function (c) {})

plasma.on(pattern, function (c, callback) {
  callback(err, data)
})
plasma.once(pattern, function (c, callback) {
  callback(err, data)
})

plasma.on([pattern1, pattern2], function (c1, c2) {
})
plasma.once([pattern1, pattern2], function (c1, c2) {
})

plasma.emit(c, function callback(err, data) {})

plasma.store(c, function callback(err, data) {})
```

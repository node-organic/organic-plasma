# Plasma

Implementation of [node-organic/Plasma](https://github.com/VarnaLab/node-organic/blob/master/docs/Plasma.md)

# public api

### `plasma.on(chemicalPattern, handler [, context, once])`

Registers `handler` as ReactionFn matching given `chemicalPattern`.

* `chemicalPattern`: Object || String || Array[ Object || String ] - the pattern used to match when handler should be invoked with emitted chemical.
* `handler`: ReactionFn - a handler function in form of `function(c [, callback])` which will be invoked.
* `context`: Object - optional, the context which will be used to invoke `handler`.
* `once`: Boolen - optional, by default is having value of `false`.

### `plasma.once(chemicalPattern, handler [, context])`

Same as `plasma.on` however the `handler` will be invoked only once per chemical matching given `chemicalPattern`.

### `plasma.emit(chemical [, callback])`

Emits `chemical` into plasma instance by invoking all matching ReactionFn handlers in parallel starting in order of their registration. In case a `handler` returns non-falsy value, the emit loop cycle is terminated and no other handlers are invoked.

* `chemical`: String || Object - if String value is provided it is transformed to `{"type": chemical}` object.
* `callback`: ReactionFn's callback - optional `function(err, chemicalResult)`

### `plasma.emitAndCollect(chemical, callback)`

Emits `chemical` into plasma instance by invoking all matching ReactionFn handlers in asynchronious order.
All results provided by handlers via their ReactionFn's callback are collected and then `callback` is invoked.

* `chemical`: String || Object - if String value is provided it is transformed to `{"type": chemical}` object.
* `callback`: ReactionFn's callback - optional `function(err, chemicalResult)`. Note that `chemicalResult` is Array when using `emitAndCollect` method.

### `plasma.pipe(dest)`

Registers `dest` function as subscriber for all chemicals been emitted through plasma.

* `dest`: `function(chemical)` - will be called per every chemical emitted in plasma.
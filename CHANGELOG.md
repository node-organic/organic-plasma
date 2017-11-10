# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - ToBeReleased

**The release contains breaking changes towards v1.x.x**
Upgrade path requires removing `organic-plasma-feedback` decoration as feedback support is re-implemented in organic-plasma module

### Changed
- `plasma.on` - supports feedback callback
- `plasma.on(array)` - supports feedback callback
- `plasma.emit` - supports feedback callback, returns `true` Boolean value when chemical has been aggregated
- `plasma.off` - supports `handler` only form in addition to `pattern` + function `handler`

### Fixed

- jasmine test specs
- plasma.emit to return true when chemical has been aggregated

## [1.2.2] - 2017-02-16

### Fixed
- `plasma.emit` will not check for missing handlers
- `new Plasma()` will not notify for missing handlers unless it is explicitly set as `new Plasma({missingHandlersChemical: String})`

## [1.2.1] - 2017-02-09

### Fixed

- `plasma.on` to properly emit on stored checmical

## [1.2.0] - 2017-02-09

### Added

- notification of missing listeners/handlers for a chemical via `plasma.on('plasma/missingHandler', function (c) {})` by [krasiyan](https://github.com/krasiyan) in [PR #4](https://github.com/outbounder/organic-plasma/pull/4)

## [1.1.0] - 2016-05-27

### Fixed

- `plasma.trash`

### Changed

- `plasma.on(pattern)` - supports class definitions for pattern
- core organic Plasma interface inheritance support for browser usage

### Added

- `plasma.has`
- `plasma.get`
- `plasma.getAll`
- `plasma.utils.deepEqual`
- `plasma.utils.isFilledArray`
- `plasma.trashAll`
- `plasma.storeAndOverride`

## [1.0.1] - 2016-02-17

### Fixed
- `plasma.pipe`


## [1.0.0] - 2016-01-14

**The release contains breaking changes towards v0.0.7.**
Upgrade path requires `organic-plasma-feedback` decoration to be applied on v1.0.0 so that v0.0.7 features are 100% covered.

### Changed
- `plasma.on` - doesn't support feedback (callback || promises)
- `plasma.on(array)` - doesn't support feedback (callback || promises)
- `plasma.emit` - doesn't support feedback (callback || promises)
- `plasma.pipe` - doesn't support transformation function

### Added
- `plasma.store`
- `plasma.trash`
- `plasma.unpipe`

### Removed
- `plasma.emitAndCollect`

## [0.0.7] - 2015-06-11
### Fixed
- plasma.once

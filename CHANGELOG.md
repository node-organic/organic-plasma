# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [1.0.0]

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

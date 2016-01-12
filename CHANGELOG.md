# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Changed
- `plasma.on` - supports feedback (promises || callbacks)
- `plasma.on(array)` - doesn't support feedback (callback || promises)
- `plasma.emit` - supports feedback (promises || callbacks)

### Added
- `plasma.store`
- `plasma.trash`
- `plasma.unpipe`

### Removed
- `plasma.emitAndCollect`

## [0.0.7] - 2015-06-11
### Fixed
- plasma.once

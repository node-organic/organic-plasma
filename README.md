# Plasma

Implementation of [node-organic/Plasma] with improvements:

* `on(["ChemicalType1", "ChemicalType2"], handler)`
* `emit("ChemicalType1", ChemicalBody)`
* `emitAndCollect("ChemicalType", doneHandler)`
* `pipe(dest)`

## Notes

* Doesn't support `sender` argument when invoking `emit`
* Provides `next` argument for handlers as noop, and only `emitAndCollect` uses callback feedback ability
module.exports = $import(
    "./Libs"
).then($imports => {
    const Unit =
        $imports.Unit;

    return Unit.Suite("Actors")([]);
});
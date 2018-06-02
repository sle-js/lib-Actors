module.exports = $importAll([
    "core:Test.Unit.Assertion:2.0.1",
    "../index.js",
    "core:Test.Unit:1.0.0"
]).then($imports => ({
    Assertion: $imports[0],
    Index: $imports[1],
    Unit: $imports[2]
}));
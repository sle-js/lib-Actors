module.exports = $import(
    "./Libs"
).then($imports => {
    const Actors =
        $imports.Index;

    const Assertion =
        $imports.Assertion;

    const Unit =
        $imports.Unit;

    return Unit.Suite("Create Actor")([(() => {
        const echoActor =
            Actors.create((self, msg, state) => [msg, Actors.None]);

        const msg =
            echoActor.send("hello");

        return Unit.Test("echo")(
            Assertion
                .equals(Actors.Msg.isSingle(msg))(true)
                .equals(Actors.Msg.singleValue(msg))("hello")
        )
    })()
    ]);
});
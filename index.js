module.exports = $importAll([
    "util"
]).then($imports => {
    const Util =
        $imports[0];


    let actorIDCount =
        0;


    // type Msg = None | Single ActorID Any | Batch (List Msg)

    const None =
        [0];

    const Single = actorID => value =>
        [1, actorID, value];

    const Batch = msgs =>
        [2, msgs];


    const deliver = msg => {
        switch (msg[0]) {
            case 0:
                break;

            case 1:
                msg[1].process(msg[2]);
                break;

            case 2:
                for (let item of msg[1]) {
                    deliver(item);
                }
                break;

        }
    };


    const Msg = {
        isNone: msg => msg[0] === 0,
        isSingle: msg => msg[0] === 1,
        singleActorID: msg => msg[1].id(),
        singleValue: msg => msg[2],
        isBatch: msg => msg[0] === 2,
        batchItems: msg => msg[1],
        deliver: deliver
    };


    // Actor : (Self -> State) -> (Self -> Msg -> State -> (State, Task)) -> Self
    function Actor(init, update) {
        this._id = actorIDCount++;
        this._state = Promise.resolve(undefined);
        this._update = update;

        const self =
            this;

        this._state = this._state
            .then(s => {
                try {
                    const result =
                        init(self);

                    deliver(result[1]);

                    return result[0];
                } catch (e) {
                    console.error(`${new Date()}: ${this.id}: Exception thrown: ${Util.inspect({
                        e: e.message,
                        stackTrace: e.stack
                    }, {depth: 3})}`);

                    return s;
                }
            });
    }


    Actor.prototype.id = function() {
        return this._id.toString();
    };


    Actor.prototype.send = function (value) {
        return Single(this)(value);
    };


    Actor.prototype.process = function (value) {
        const self =
            this;

        this._state = this._state
            .then(s => {
                try {
                    const result =
                        self._update(self, value, s);

                    deliver(result[1]);

                    return result[0];
                } catch (e) {
                    console.error(`${new Date()}: ${this.id}: Exception thrown: ${Util.inspect({
                        state: s,
                        value: value,
                        e: e.message,
                        stackTrace: e.stack
                    }, {depth: 3})}`);

                    return s;
                }
            });
    };


    const create = (update, init) =>
        new Actor(init ? init : self => [0, None], update);


    return {
        create,
        None,
        Batch,
        Msg
    };
});
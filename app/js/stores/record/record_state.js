var Immutable = require("immutable");

// This a definition of the state accepted, understood
// and managed by the record_reducer the valid state
// recall we are using Immutable records to improve
// our typing and apply constraints. So don't be pissed
// when a record doesn't automatically work because you haven't
// added it's kind here.
var RecordState = Immutable.Record({
    event: Immutable.Map(),
    location: Immutable.Map(),
    profile: Immutable.Map(),
    tag: Immutable.Map(),
    task: Immutable.Map(),
    user: Immutable.Map(),
});

module.exports = RecordState;

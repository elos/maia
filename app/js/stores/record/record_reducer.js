// --- Imports {{{

// --- External ---
var Immutable = require("immutable");

// --- Internal ---
var AppConstants = require("../../constants/app-constants");

// --- }}}

// This is the valid state
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

function reduceUpdate(state, data) {
    var kind = data.kind;
    var record = data.record;

    if (state.get(kind) === undefined) {
        throw "Unknown record kind: '" + kind + "'";
    }

    if (record.id === undefined) {
        throw "Undefined record id";
    }

    return state.set(
        kind,
        state.get(kind).set(record.id, record)
    );
}

function reduceDelete(state, data) {
    var kind = data.kind;
    var record = data.record;

    if (state.get(kind) === undefined) {
        throw "Unknown record kind: '" + kind + "'";
    }

    if (record.id === undefined) {
        throw "Undefined record id";
    }

    return state.set(
        kind,
        state.get(kind).remove(record.id)
    );
}

// this is it
function records(state, action) {
    if (state === null || state === undefined) {
        state = new RecordState();
    }

    switch (action.type) {
        case AppConstants.RECORD_UPDATE:
            return reduceUpdate(state, action.data);
        case AppConstants.RECORD_DELETE:
            return reduceDelete(state, action.data);
        default:
            return state;
    }
}

module.exports = records;

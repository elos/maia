// --- Imports {{{

// --- External ---
var Immutable = require("immutable");

// --- Internal ---
var AppConstants = require("../../constants/app-constants");
var RecordState = require("./record_state.js");
var RecordErrors = require("./record_errors.js");

// --- }}}


function reduceUpdate(state, data) {
    var kind = data.kind;
    var record = data.record;

    if (state.get(kind) === undefined) {
        throw RecordErrors.UnknownKind(kind);
    }

    if (record.id === undefined) {
        throw RecordErrors.UndefinedID();
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
        throw RecordErrors.UnknownKind(kind);
    }

    if (record.id === undefined) {
        throw RecordErrors.UndefinedID();
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

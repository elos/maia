var Immutable = require("immutable");
var RecordErrors = require("./record_errors.js");

function getAll(state /*RecordState*/, kind /*string*/) {
    switch (state.get(kind)) {
        case undefined:
            throw RecordErrors.UnknownKind(kind);
        default:
            return state.get(kind).toSet();
    }
}

// Maybe<Undefined, Record<Kind>
function getOne(state /*RecordState*/, kind /*string*/, id /*string*/) {
    switch (state.get(kind)) {
        case undefined:
            throw RecordErrors.UnknownKind(kind);
        default:
            if (id === undefined) {
                throw RecordErrors.UndefinedID();
            }

            return state.get(kind).get(id);
    }
}

module.exports = {
    getAll: getAll,
    getOne: getOne,
};

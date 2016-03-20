var Immutable = require("immutable");

// There are the errors which the record_reducer, or
// a record_derived might throw.
module.exports = {
    UnknownKind: function (kind /*string*/) {
        return "Unknown record kind: '" + kind + "'";
    },
    UndefinedID: function () {
        return "Undefined record id";
    },
};

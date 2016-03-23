import Immutable from "immutable";

// There are the errors which the record_reducer, or
// a record_derived might throw.
const errors = {
  UnknownKind: function(kind /*string*/ ) {
    return "Unknown record kind: '" + kind + "'";
  },
  UndefinedID: function() {
    return "Undefined record id";
  },
};

export default errors;
module.exports = errors;

import Immutable from "immutable";
import RecordErrors from "./record_errors.js";

function getAll(state /*RecordState*/ , kind /*string*/ ) {
  switch (state) {
    case null:
    case undefined:
      return Immutable.Set();
    default:
      switch (state.get(kind)) {
        case undefined:
          throw RecordErrors.UnknownKind(kind);
        default:
          return state.get(kind).toSet();
      }
  }
}

// Maybe<Undefined, Record<Kind>
function getOne(state /*RecordState*/ , kind /*string*/ , id /*string*/ ) {
  switch (state) {

    // Ill-defined state
    case null:
    case undefined:
      return undefined;

    // Well-defined state
    default:
      switch (state.get(kind)) {
        // Ill-defined kind
        case null:
        case undefined:
          throw RecordErrors.UnknownKind(kind);

        // Well-defined kind
        default:
          switch (id) {
            // Ill-defined id
            case null:
            case undefined:
              throw RecordErrors.UndefinedID();

            // Well-defined id
            default:
              return state.get(kind).get(id);
          }
      }
  }
}

const core = {
  getAll: getAll,
  getOne: getOne,
};

export { getAll, getOne };
export default core;
module.exports = core;

// --- Imports {{{

// --- External ---
import Immutable from "immutable";

// --- Internal ---
import AppConstants from "../../constants/app-constants";
import RecordState from "./record_state.js";
import RecordErrors from "./record_errors.js";

// --- }}}

function reduceUpdate(state, data) {
  const kind = data.kind;
  const record = data.record;

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
  const kind = data.kind;
  const record = data.record;

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

function reduceBatchUpdate(state, data) {
  data.keySeq().forEach(function(key) {
    data.get(key).forEach(function(record) {
      state = reduceUpdate(state, {
        kind: key,
        record: record
      });
    });
  });

  return state;
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
    case AppConstants.RECORD_BATCH_UPDATE:
      return reduceBatchUpdate(state, action.data);
    default:
      return state;
  }
}

export default records;
module.exports = records;

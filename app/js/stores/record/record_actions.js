// --- Imports {{{

// --- External ---
import Immutable from "immutable";

// --- Internal ---
import AppConstants from "../../constants/app-constants";

// --- }}}

// RecordActionData is the payload associated with
// the UPDATE and DELETE actions
const RecordActionData = Immutable.Record({
  kind: "",
  record: Immutable.Map(),
});

const RecordBatchActionData = Immutable.Record({});

// RecordUpdateActions represents an update has occured to a record
// and that it should be updated
const RecordUpdateAction = Immutable.Record({
  type: AppConstants.RECORD_UPDATE,
  data: new RecordActionData(),
});

// RecordDeleteAction represents that the record in question has been
// deleted and should be removed
const RecordDeleteAction = Immutable.Record({
  type: AppConstants.RECORD_DELETE,
  data: new RecordActionData(),
});

const RecordBatchUpdateAction = Immutable.Record({
  type: AppConstants.RECORD_BATCH_UPDATE,
  data: new RecordBatchActionData(),
});

// var RecordActions = require("../path/.../record_actions);
// updateAction = RecordActions.update('user', new User({name: "Nick"}));
const core = {
  // Factory to construct an update action
  update: function(kind /*string*/ , record /*Immutable.{Map|Record}*/ ) {
    return new RecordUpdateAction({
      data: new RecordActionData({
        kind: kind,
        record: record,
      }),
    });
  },

  // delete is a factory to construct a delete action
  delete: function(kind /*string*/ , record /*Immutable.{Map|Record}*/ ) {
    return new RecordDeleteAction({
      data: new RecordActionData({
        kind: kind,
        record: record,
      }),
    });
  },

  batch_update: function(kindMap /*map[string]objects*/ ) {
    return new RecordBatchUpdateAction({
      data: kindMap,
    });
  },
};

export { core, RecordActionData, RecordBatchActionData, RecordUpdateAction, RecordDeleteAction, RecordBatchUpdateAction };
export default core;
module.exports = core;

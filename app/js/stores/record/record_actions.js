// --- Imports {{{

// --- External ---
var Immutable = require("immutable");

// --- Internal ---
var AppConstants = require("../../constants/app-constants");

// --- }}}

// RecordActionData is the payload associated with
// the UPDATE and DELETE actions
var RecordActionData = Immutable.Record({
    kind: "",
    record: Immutable.Map(),
});

// RecordUpdateActions represents an update has occured to a record
// and that it should be updated
var RecordUpdateAction = Immutable.Record({
    type: AppConstants.RECORD_UPDATE,
    data: new RecordActionData(),
});

// RecordDeleteAction represents that the record in question has been
// deleted and should be removed
var RecordDeleteAction = Immutable.Record({
    type: AppConstants.RECORD_DELETE,
    data: new RecordActionData(),
});

// var RecordActions = require("../path/.../record_actions);
// updateAction = RecordActions.update('user', new User({name: "Nick"}));
module.exports = {
    // Factory to construct an update action
    update: function(kind /*string*/, record /*Immutable.{Map|Record}*/) {
        return new RecordUpdateAction({
            data: new RecordActionData({
                kind: kind,
                record: record,
            }),
        });
    },

    // delete is a factory to construct a delete action
    delete: function(kind /*string*/, record /*Immutable.{Map|Record}*/) {
        return new RecordDeleteAction({
            data: new RecordActionData({
                kind: kind,
                record: record,
            }),
        });
    },
};




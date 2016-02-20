var RecordActions = require ("../actions/record-actions");

var Logger = require("../utils/Logger");
var DB = require("../core/db");

var RecordActionCreators = {

    save: function(kind, record) {
        DB.save(kind, record, {
            resolve: function (record) {
                RecordActions.update(kind, record);
            },
            error: function (error) {
                // TODO(nclandolfi) APIErrorStore
                Logger.info("ERROR IN RECORD_ACTIONS>SAVE: " + error);
            },
        });
    },

    query: function (kind, attrs) {
        RecordActions.generateQuery(kind, attrs);
    },

};

module.exports = RecordActionCreators;

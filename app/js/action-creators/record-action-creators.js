// Require our own modules
var Logger = require("../utils/Logger");
var DB = require("../core/db");
var RecordActions = require ("../actions/record-actions");

var RecordActionCreators = {

    find: function (kind, id) {
        DB.find(kind, id, {
            resolve: function (record) {
                RecordActions.update(record);
            },
            error: function (error) {
                Logger.info("ERR:" + error);
            },
        });
    },

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

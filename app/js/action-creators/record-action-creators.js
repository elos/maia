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

    save: function(kind, record, handlers) {
        // optional args
        handlers = handlers || {};
        handlers.success = handlers.success || function() {};
        handlers.failure = handlers.failure || function() {};

        DB.save(kind, record, {
            resolve: function (record) {
                RecordActions.update(kind, record);
                handlers.success(record);
            },
            error: function (error) {
                // TODO(nclandolfi) APIErrorStore
                Logger.info("ERROR IN RECORD_ACTIONS>SAVE: " + error);
                handlers.failure(error);
            },
        });
    },

    delete: function (kind, record, handlers) {
        // optional args
        handlers = handlers || {};
        handlers.success = handlers.success || function() {};
        handlers.failure = handlers.failure || function() {};

        DB.delete(kind, record.id, {
            resolve: function () {
                RecordActions.delete(kind, record);
                handlers.success(record);
            },
            error: function (error) {
                // TODO(nclandolfi) APIErrorStore
                Logger.info("ERROR IN RECORD_ACTIONS delete: " + error);
                handlers.failure(error);
            },
        });
    },

    query: function (kind, attrs, handlers) {
        // optional args
        handlers = handlers || {};
        handlers.success = handlers.success || function() {};
        handlers.failure = handlers.failure || function() {};

        DB.query(kind, attrs, {
            resolve: function (records) {
                records.forEach(function (record) {
                    RecordActions.update(kind, record);
                });

                handlers.success(records);
            },
            error: function (error) {
                // TODO(nclandolfi) APIErrorStore
                Logger.info("ERROR IN RECORD_ACTIONS Query: " + error);
                handlers.failure(error);
            },
        });
    },
};

module.exports = RecordActionCreators;

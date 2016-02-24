var AppDispatcher = require("../dispatcher/app-dispatcher");
var AppConstants = require("../constants/app-constants");
var RecordActionCreators = require("../action-creators/record-action-creators");

var TagActions = {
    refreshTags: function (handlers) {
        handlers = handlers || {};
        handlers.success = handlers.success || function() {};
        handlers.failure = handlers.failure || function() {};

        RecordActionCreators.query('tag', {}, handlers);
    }
};

module.exports = TagActions;

var AppDispatcher = require("../dispatcher/app-dispatcher");
var AppConstants = require("../constants/app-constants");

var Logger = require("../utils/Logger");

var RecordActions = {
    update: function (kind, r) {
        AppDispatcher.dispatch({
            actionType: AppConstants.RECORD_UPDATE,
            data: {
                kind: kind,
                record: r
            }
        });
    },

    delete: function (kind, id) {
        AppDispatcher.dispatch({
            actionType: AppConstants.RECORD_DELETE,
            data: {
                kind: kind,
                id: id
            }
        });
    },

    generateQuery: function (kind, attrs) {
        AppDispatcher.dispatch({
            actionType: AppConstants.RECORD_QUERY,
            data: {
                kind: kind,
                attrs: attrs,
            }
        });
    }
};

module.exports = RecordActions;

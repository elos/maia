var AppDispatcher = require("../dispatcher/app-dispatcher");
var AppConstants = require("../constants/app-constants");

var RecordActions = {
    save: function (kind, r) {
        AppDispatcher.dispatch({
            actionType: AppConstants.RECORD_UPDATE,
            data: {
                kind: kind,
                record: r
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

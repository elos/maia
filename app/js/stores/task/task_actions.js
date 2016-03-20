var Immutable = require("immutable");
var AppConstants = require("../../../constants/app-constants");

var TaskRefreshRequestAction = Immutable.Record({
    type: AppConstants.TASK_REFRESH_REQUEST,
});

var TaskRefreshSuccessAction = Immutable.Record({
    type: AppConstants.TASK_REFRESH_SUCCESS,
});

var TaskRefreshFailureAction = Immutable.Record({
    type: AppConstants.TASK_REFRESH_FAILURE,
});

module.exports = {
    refresh_request: function () {
        return new TaskRefreshRequestAction();
    },
    refresh_success: function () {
        return new TaskRefreshSuccessAction();
    },
    refresh_failure: function () {
        return new TaskRefreshFailureAction();
    },
};

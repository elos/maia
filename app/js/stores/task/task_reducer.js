var TaskState = require("./task-state");
var AppConstants = require("../../../constants/app-constants");

function task_reducer(state, action) {
    if (state === null || state === undefined) {
        state = new TaskState();
    }

    switch (action.type) {
        case AppConstants.TASK_REFRESH_REQUEST:
            return state.set('loading', true);
        case AppConstants.TASK_REFRESH_SUCCESS:
            return state.set('loading', false);
        case AppConstants.TASK_REFRESH_FAILURE:
            return state.set('loading', false);
        default:
            return state;
    }
}

module.exports = task_reducer;

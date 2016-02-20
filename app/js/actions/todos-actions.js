var AppDispatcher = require("../dispatcher/app-dispatcher");
var AppConstants = require("../constants/app-constants");

var TodosActions = {
    refreshTasks: function () {
        AppDispatcher.dispatch({
            actionType: AppConstants.TODOS_REFRESH,
        });
    },

    completeTask: function (id) {
        AppDispatcher.dispatch({
            actionType: AppConstants.TODOS_COMPLETE,
            data: {
                task_id: id,
            }
        });
    },

    startTask: function (id) {
        AppDispatcher.dispatch({
            actionType: AppConstants.TODOS_START,
            data: {
                task_id: id,
            }
        });
    },

    stopTask: function (id) {
        AppDispatcher.dispatch({
            actionType: AppConstants.TODOS_STOP,
            data: {
                task_id: id,
            }
        });
    },

    deleteTask: function (id) {
        AppDispatcher.dispatch({
            actionType: AppConstants.TODOS_DELETE,
            data: {
                task_id: id,
            }
        });
    }
};

module.exports = TodosActions;

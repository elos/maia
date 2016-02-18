var AppDispatcher = require("../dispatcher/app-dispatcher");
var AppConstants = require("../constants/app-constants");

var TodosActions = {
    completeTask: function (id) {
        AppDispatcher.dispatch({
            actionType: AppConstants.TODOS_COMPLETE,
            data: {
                task_id: id,
            }
        });
    }
};

module.exports = TodosActions;

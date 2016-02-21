var TodosActions = require ("../actions/todos-actions");
var SnackbarActionCreators = require("../action-creators/snackbar-action-creators");

var TodosActionCreators = {

    refresh: function () {
        TodosActions.refreshTasks();
    },

    create: function () {
        SnackbarActionCreators.showMessage("Not implemented");
    },

    start: function (id) {
        TodosActions.startTask(id);
    },

    stop: function (id) {
        TodosActions.stopTask(id);
    },

    edit: function () {
        SnackbarActionCreators.showMessage("Not implemented");
    },

    complete: function (id) {
        TodosActions.completeTask(id);
    },

    delete: function (id) {
        TodosActions.deleteTask(id);
    },
};

module.exports = TodosActionCreators;

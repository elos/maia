var TodosActions = require ("../actions/todos-actions");
var SnackbarActionCreators = require("../action-creators/snackbar-action-creators");
var ActiveUserStore = require('../stores/active-user-store');
var Logger = require("../utils/logger");
var RouteActionCreator = require("../action-creators/route-action-creator");

var TodosActionCreators = {

    refresh: function () {
        TodosActions.refreshTasks();
    },


    start: function (id) {
        TodosActions.startTask(id);
    },

    stop: function (id) {
        TodosActions.stopTask(id);
    },

    edit: function (task) {
        TodosActions.editTask(task);
        RouteActionCreator.ShowTodosEditor();
    },

    create: function () {
        TodosActions.editTask({});
        RouteActionCreator.ShowTodosEditor();
    },

    complete: function (id) {
        TodosActions.completeTask(id);
    },

    delete: function (id) {
        TodosActions.deleteTask(id);
    },

    save: function (data) {
        if (!data.name || data.name.length === 0) {
            SnackbarActionCreators.showMessage("Must have a name");
            return;
        }

        data.created_at = new Date();
        data.updated_at = new Date();

        if (!data.owner_id) {
            Logger.info(ActiveUserStore.getID());
            data.owner_id = ActiveUserStore.getID();
        }

        TodosActions.saveTask(data);
    },

    goal: function (task) {
        TodosActions.makeGoal(task);
    },

    dropGoal: function (task) {
        TodosActions.dropGoal(task);
    },
};

module.exports = TodosActionCreators;

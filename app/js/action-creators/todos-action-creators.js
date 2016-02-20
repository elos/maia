var TodosActions = require ("../actions/todos-actions");

var TodosActionCreators = {

    complete: function (id) {
        TodosActions.completeTask(id);
    },

    start: function (id) {
        TodosActions.startTask(id);
    },

    stop: function (id) {
        TodosActions.stopTask(id);
    },

    delete: function (id) {
        TodosActions.deleteTask(id);
    },
};

module.exports = TodosActionCreators;

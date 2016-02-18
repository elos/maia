var TodosActions = require ("../actions/todos-actions");

var TodosActionCreators = {

    complete: function (id) {
        TodosActions.completeTask(id);
    },

};

module.exports = TodosActionCreators;

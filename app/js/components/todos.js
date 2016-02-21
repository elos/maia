/*
 * Require all third party libraries
 *
 * 1. `react` is required for `React.createClass`
 * 2/ `moment` is require for duration formatting
 */
var React = require("react");
var moment = require("moment");

/*
 * Require any local code we need, like stores, utils etc.
 */
var Logger = require("../utils/logger");
var CLIStore = require("../stores/cli-store");
var CLIActionCreator = require("../action-creators/cli-action-creator");
var RouteActionCreator = require("../action-creators/route-action-creator");
var TodosActionCreators = require("../action-creators/todos-action-creators");
var TodosStore = require("../stores/todos-store");
var MDL = require("../utils/mdl");
var SnackbarActionCreators = require("../action-creators/snackbar-action-creators.js");
var TaskTable = require("./task-table");

/*
 * "Private" variables and functions can go here
 */

var Todos = React.createClass({

    /*
     * Called once when the component is mounted
     */
    componentDidMount: function () {
        TodosStore.addChangeListener(this._onNewChange);
        TodosActionCreators.refresh();
        MDL.refresh();
    },

    /*
     * Called once when the component is unmounted
     */
    componentWillUnmount: function () {
        TodosStore.removeChangeListener(this._onNewChange);
    },

    /*
     * Called when the compoenent's changes are flushed to the DOM
     */
    componentDidUpdate: function() {
        // This upgrades all upgradable components (i.e. with 'mdl-js-*' class)
        MDL.refresh();
    },

    /*
     * Called once before componentDidMount to set the initial component state.
     */
    getInitialState: function () {
        return {
            todos: null,
        };
    },

    completeTodo: function (id) {
        TodosActionCreators.complete(id);
    },

    stopTodo: function (id) {
        TodosActionCreators.stop(id);
    },

    startTodo: function (id) {
        TodosActionCreators.start(id);
    },

    editTask: function (id) {
        SnackbarActionCreators.showMessage("Not implemented");
    },

    newTodo: function () {
        SnackbarActionCreators.showMessage("Not implemented");
    },

    /*
     * Called every time the state changes
     */
    render: function () {
        // We haven't loaded them yet
        if (this.state.todos === null) {
            return (
                <div style={{margin: "200px auto"}} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
            );
        }

        var currentTodos = this.state.todos.filter(TodosStore.isCompleted);

        var Todos = this;

        return (
            <div id="todos-container">
                <div id="todos-header">
                    <h2 id="todos-title"> Todos </h2>
                    <button id="add-task-button" style={{marginRight: 10}}
                            className="mdl-button mdl-js-button mdl-button--icon"
                            onClick={Todos.newTodo}>
                        <i className="material-icons">add</i>
                    </button>
                    <div className="mdl-tooltip" htmlFor="add-task-button">
                        New Task
                    </div>
                </div>
                <TaskTable />
            </div>
        );
    },

    /*
     * Private functions
     */
    _onNewChange: function () {
        this.setState({todos: TodosStore.getTodos()});
    }
})

module.exports = Todos;

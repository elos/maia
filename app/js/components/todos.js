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
            todos: TodosStore.getTodos(),
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
        var now = new Date();

        var currentTodos = this.state.todos.filter(function(todo) {
            var d = new Date(todo.completed_at);
            return d.getTime() === -62135596800000; // not compelted
        });

        // add in_progress, deadline_formatted, and time_spend attributes
        currentTodos.forEach(function (todo) {
            todo.stages = todo.stages || [];

            todo.in_progress = todo.stages.length % 2 === 1;

            var deadline = new Date(todo.deadline);
            todo.deadline_formatted = (deadline.getTime() === -62135596800000) ? "None" : deadline.toLocaleString();

            var stages = todo.stages.map(function (stage) {
                return new Date(stage);
            });

            if (stages.length % 2 === 1) {
                stages.push(new Date());
            }

            var i;

            var msSpent = 0;
            for (i = 0; i < stages.length;  i += 2) {
                msSpent += stages[i+1].getTime() - stages[i].getTime();
            }

            todo.time_spent = (msSpent === 0) ? "" : moment.duration(msSpent).humanize();
        });

        // by in progress or not
        currentTodos.sort(function (a, b) {
            var ad = new Date(a.deadline);
            var bd = new Date(b.deadline);

            if (a.in_progress) {
                if (b.in_progress) {
                    if (ad.getTime() === -62135596800000) {
                        return 1;
                    }

                    return ad.getTime() - bd.getTime();
                }

                return -1;
            }

            if (b.in_progress) {
                return 1;
            }

            if (ad.getTime() === -62135596800000) {
                return 1;
            }

            return ad.getTime() - bd.getTime();
        });

        var Todos = this;

        return (
            <div className="todos">
                <div className="todos-title">
                    <h2 className="todos-title-text"> Todos </h2>
                    <button id="add-task-button" style={{marginRight: 10}}
                            className="mdl-button mdl-js-button mdl-button--icon"
                            onClick={Todos.newTodo}>
                        <i style={{fontSize: 18}} className="material-icons">add</i>
                    </button>
                    <div className="mdl-tooltip" htmlFor="add-task-button">
                        New Task
                    </div>
                </div>
                <table className="todos-table mdl-data-table mdl-js-data-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th className="mdl-data-table__cell--non-numeric">Name</th>
                      <th className="mdl-data-table__cell--non-numeric">Deadline</th>
                      <th className="mdl-data-table__cell--non-numeric">Time Spent</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTodos.map(function(todo, i) {
                        return (
                            <tr key={i} className={(todo.in_progress) ? "todo-in-progress":""}>
                              <td>
                                {function () {
                                    if (!todo.in_progress) {
                                        return (
                                            <span>
                                                <button id={"start-" + todo.id} className="mdl-button mdl-js-button mdl-button--icon"
                                                        onClick={Todos.startTodo.bind(null, todo.id)}>
                                                    <i className="material-icons">play_circle_outline</i>
                                                </button>
                                                <div className="mdl-tooltip mdl-tooltip--left" htmlFor={"start-" + todo.id}>
                                                    Start Task
                                                </div>
                                            </span>
                                           );
                                    } else {
                                        return (
                                            <span>
                                                <button id={"stop-" + todo.id} className="mdl-button mdl-js-button mdl-button--icon"
                                                        onClick={Todos.stopTodo.bind(null, todo.id)}>
                                                    <i className="material-icons">pause_circle_outline</i>
                                                </button>
                                                <div className="mdl-tooltip mdl-tooltip--left" htmlFor={"stop-" + todo.id}>
                                                    Stop Task
                                                </div>
                                            </span>
                                           );
                                    }
                                 }()
                                }
                              </td>
                              <td className="mdl-data-table__cell--non-numeric">
                                {todo.name}
                              </td>
                              <td className="mdl-data-table__cell--non-numeric">{todo.deadline_formatted}</td>
                              <td className="mdl-data-table__cell--non-numeric">{todo.time_spent}</td>
                              {/*
                              <td className="mdl-data-table__cell--non-numeric">
                                    <button id={"complete-" + i} className="mdl-button mdl-js-button mdl-button--icon"
                                            onClick={Todos.completeTodo.bind(null, todo.id)}>
                                        <i className="material-icons">done</i>
                                    </button>
                                    <div className="mdl-tooltip mdl-tooltip--right" htmlFor={"complete-" + i}>
                                        Complete
                                    </div>
                                </td> */}
                                <td>
                                    <button id={todo.id + "-action-menu"} className="mdl-button mdl-js-button mdl-button--icon">
                                        <i className="material-icons">more_vert</i>
                                    </button>

                                    <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
                                        htmlFor={todo.id + "-action-menu"}
                                        >
                                        <li className="mdl-menu__item" onClick={Todos.completeTodo.bind(null, todo.id)}>
                                            Complete
                                        </li>
                                        <li className="mdl-menu__item" onClick={Todos.editTask.bind(null, todo.id)}>
                                            Edit
                                        </li>
                                        <li className="mdl-menu__item" onClick={TodosActionCreators.delete.bind(TodosActionCreators, todo.id)}>
                                            Delete
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        )
                    })}
                  </tbody>
                </table>
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

/*
 * Require all third party libraries
 *
 * 1. `react` is required for `React.createClass`
 * 2/ `moment` is require for duration formatting
 */
var React = require("react");

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

var TaskTable = React.createClass({

    /*
     * Called once when the component is mounted
     */
    componentDidMount: function () {
        TodosStore.addChangeListener(this._onNewChange);
        MDL.refresh();
    },

    /*
     * Called once when the component is unmounted
     */
    componentWillUnmount: function () {
        TodosStore.addChangeListener(this._onNewChange);
    },

    /*
     * Called when the compoenent's changes are flushed to the DOM
     */
    componentDidUpdate: function() {
        MDL.refresh();
    },

    /*
     * Called once before componentDidMount to set the initial component state.
     */
    getInitialState: function () {
        return {
            tasks: TodosStore.getTodos(),
        };
    },

    /*
     * Called every time the state changes
     */
    render: function () {
        // We haven't loaded them yet
        if (this.state.tasks === null) {
            return (
                <div style={{margin: "200px auto"}} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
            );
        }

        var tasks = this.state.tasks.filter(TodosStore.isCompleted);

        var Todos = this;

        return (
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
                {tasks.map(function(todo, i) {
                    return (
                        <tr key={i} className={(todo.in_progress) ? "todo-in-progress":""}>
                          <td>
                            {function () {
                                if (!todo.in_progress) {
                                    return (
                                        <span>
                                            <button id={"start-" + todo.id} className="mdl-button mdl-js-button mdl-button--icon"
                                                    onClick={TodosActionCreators.start.bind(null, todo.id)}>
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
                                                    onClick={TodosActionCreators.stop.bind(null, todo.id)}>
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
                                    <li className="mdl-menu__item" onClick={TodosActionCreators.complete.bind(null, todo.id)}>
                                        Complete
                                    </li>
                                    <li className="mdl-menu__item" onClick={TodosActionCreators.edit.bind(null, todo.id)}>
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
        );
    },

    /*
     * Private functions
     */
    _onNewChange: function () {
        this.setState({tasks: TodosStore.getTodos()});
    }
})

module.exports = TaskTable;

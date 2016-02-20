/*
 * Require all third party libraries
 *
 * 1. `react` is required for `React.createClass`
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

/*
 * "Private" variables and functions can go here
 */

var Todos = React.createClass({

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

    /*
     * Called every time the state changes
     */
    render: function () {
        var now = new Date();

        var currentTodos = this.state.todos.filter(function(todo) {
            var d = new Date(todo.completed_at);
            return d.getTime() === -62135596800000; // not compelted
        });

        var Todos = this;

        return (
            <div className="todos">
                <div className="todos-title">
                    <h2 className="todos-title-text"> Todos </h2>
                </div>
                <table className="todos-table mdl-data-table mdl-js-data-table">
                  <thead>
                    <tr>
                      <th className="mdl-data-table__cell--non-numeric">Name</th>
                      <th className="mdl-data-table__cell--non-numeric">Deadline</th>
                      <th>Salience</th>
                      <th className="mdl-data-table__cell--non-numeric">Time Spent</th>
                      <th>  </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTodos.map(function(todo, i) {
                        return (
                            <tr key={i}>
                              <td className="mdl-data-table__cell--non-numeric">{todo.name.substring(0, 30)}</td>
                              <td className="mdl-data-table__cell--non-numeric">{todo.deadline}</td>
                              <td>0</td>
                              <td className="mdl-data-table__cell--non-numeric">0</td>
                              <td className="mdl-data-table__cell--non-numeric">
                                    <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"
                                            onClick={Todos.completeTodo.bind(null, todo.id)}
                                            >
                                      Complete
                                    </button>
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

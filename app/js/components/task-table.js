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
// Utilities
var MDL = require("../utils/mdl");

var TodosActionCreators = require("../action-creators/todos-action-creators");
var TodosStore = require("../stores/todos-store");
var TagStore = require("../stores/tag-store");
var TagActionCreators = require("../action-creators/tag-action-creators");
var Table = require("material-ui/lib/table/table");
var TableHeaderColumn =require( 'material-ui/lib/table/table-header-column');
var TableRow =require( 'material-ui/lib/table/table-row');
var TableHeader=require( 'material-ui/lib/table/table-header');
var TableRowColumn =require( 'material-ui/lib/table/table-row-column');
var TableBody =require( 'material-ui/lib/table/table-body');

/*
 * "Private" variables and functions can go here
 */

var TaskTable = React.createClass({

    /*
     * Called once when the component is mounted
     */
    componentDidMount: function () {
        TodosStore.addChangeListener(this._onNewChange);
        TagStore.addChangeListener(this._tagChange);
        TagActionCreators.issueRefresh();
        MDL.refresh();
    },

    /*
     * Called once when the component is unmounted
     */
    componentWillUnmount: function () {
        TodosStore.removeChangeListener(this._onNewChange);
        TagStore.removeChangeListener(this._tagChange);
    },

    _tagChange: function () {
        this.forceUpdate();
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
            <Table selectable={false}>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn></TableHeaderColumn>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn>Deadline</TableHeaderColumn>
                  <TableHeaderColumn>Time Spent</TableHeaderColumn>
                  <TableHeaderColumn></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody selectable={false} displayRowCheckbox={false}>
                {tasks.map(function(todo) {
                    return (
                        <TableRow key={todo.id} className={(todo.in_progress) ? "todo-in-progress":""}>
                          <TableRowColumn>
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
                          </TableRowColumn>
                          <TableRowColumn className="mdl-data-table__cell--non-numeric">
                            {todo.name}
                            <div style={{display:"flex", flexDirection: "row"}}>
                            {todo.tags_ids.map(function (id) {
                                var name = TagStore.nameForID(id);
                                if (name && name !== "") {
                                    return (
                                      <div style={{borderRadius: 3, border: "1px solid #CCCCCC", padding: "0 5px", fontSize: 10, marginRight:3}}>{name}</div>
                                  );
                                }
                             })}
                            </div>
                          </TableRowColumn>
                          <TableRowColumn className="mdl-data-table__cell--non-numeric">{todo.deadline_formatted}</TableRowColumn>
                          <TableRowColumn className="mdl-data-table__cell--non-numeric">{todo.time_spent}</TableRowColumn>
                          {/*
                          <TableRowColumn className="mdl-data-table__cell--non-numeric">
                                <button id={"complete-" + i} className="mdl-button mdl-js-button mdl-button--icon"
                                        onClick={TodosActionCreators.complete.bind(null, todo.id)}>
                                    <i className="material-icons">done</i>
                                </button>
                                <div className="mdl-tooltip mdl-tooltip--right" htmlFor={"complete-" + i}>
                                    Complete
                                </div>
                            </TableRowColumn> */}
                            <TableRowColumn>
                                <button id={todo.id + "-action-menu"} className="mdl-button mdl-js-button mdl-button--icon">
                                    <i className="material-icons">more_vert</i>
                                </button>

                                <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
                                    htmlFor={todo.id + "-action-menu"}
                                    >
                                    <li className="mdl-menu__item" onClick={TodosActionCreators.complete.bind(null, todo.id)}>
                                        Complete
                                    </li>
                                    {function(){
                                        var tagNames = todo.tags_ids.map(function(id) { return TagStore.nameForID(id); });
                                        if (tagNames.indexOf("GOAL") >= 0) {
                                            return (
                                            <li className="mdl-menu__item" onClick={TodosActionCreators.dropGoal.bind(null, todo)}>
                                                Drop Goal
                                            </li>
                                            );
                                        } else {
                                            return (
                                            <li className="mdl-menu__item" onClick={TodosActionCreators.goal.bind(null, todo)}>
                                                Make Goal
                                            </li>
                                            );
                                        }
                                    }()}
                                    <li className="mdl-menu__item" onClick={TodosActionCreators.edit.bind(null, todo)}>
                                        Edit
                                    </li>
                                    <li className="mdl-menu__item" onClick={TodosActionCreators.delete.bind(TodosActionCreators, todo.id)}>
                                        Delete
                                    </li>
                                </ul>
                            </TableRowColumn>
                        </TableRow>
                    )
                })}
                </TableBody>
            </Table>
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

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

var TodosActionCreators = require("../action-creators/todos-action-creators");
var TodosStore = require("../stores/todos-store");
var TagStore = require("../stores/tag-store");
var TagActionCreators = require("../action-creators/tag-action-creators");

import LinearProgress from 'material-ui/lib/linear-progress';
import Paper from "material-ui/lib/paper";
import Table from "material-ui/lib/table/table";
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

var TaskTableImplementation = require("./task_table/task_table_implementation");

var TodosActionCreators = require("../action-creators/todos-action-creators");

import { Task } from "../core/models";

var TaskTable = React.createClass({

  // Called once when the component is mounted
  componentDidMount: function() {
    TodosStore.addChangeListener(this._onNewChange);
    TagStore.addChangeListener(this._tagChange);
    TagActionCreators.issueRefresh();
  },

  // Called once when the componenet is unmounted
  componentWillUnmount: function() {
    TodosStore.removeChangeListener(this._onNewChange);
    TagStore.removeChangeListener(this._tagChange);
  },

  _tagChange: function() {
    this.forceUpdate();
  },

  /*
   * Called once before componentDidMount to set the initial component state.
   */
  getInitialState: function() {
    return {
      tasks: TodosStore.getTodos(),
    };
  },

  /*
   * Called every time the state changes
   */
  render: function() {
    var in_progress = this.state.tasks === null || this.state.tasks.count() === 0;
    var tasks = this.state.tasks.filter(TodosStore.isCompleted);
    return <TaskTableImplementation isLoading={in_progress} tasks={tasks.toList().map((t) => new Task(t))} actionCreator={TodosActionCreators}/>;
  },

  /*
   * Private functions
   */
  _onNewChange: function() {
    this.setState({
      tasks: TodosStore.getTodos()
    });
  }
})

module.exports = TaskTable;

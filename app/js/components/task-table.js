// --- Imports {{{

// --- External
import React from "react";
import Immutable from "immutable";

// --- Internal
import { Task, Tag } from "../core/models";
var TodosStore = require("../stores/todos-store");
var TagStore = require("../stores/tag-store");
var TagActionCreators = require("../action-creators/tag-action-creators");
import TaskTableImplementation from "./task_table/task_table_implementation";
var TodosActionCreators = require("../action-creators/todos-action-creators");
// --- }}}

const TaskTable = React.createClass({

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
    var tasks = this.state.tasks.toList()
      .filter(TodosStore.isCompleted)
      .map((t) => new Task(t))
      .map((task) => task.set(
        "tags",
        Immutable.List(task.tags_ids.map((tag_id) => new Tag({
          "id": tag_id,
          "name": TagStore.nameForID(tag_id)
        })))));

    return <TaskTableImplementation isLoading={in_progress} tasks={tasks} actionCreator={TodosActionCreators}/>;
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

export default TaskTable;
module.exports = TaskTable;

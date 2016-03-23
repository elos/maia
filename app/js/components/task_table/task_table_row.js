// --- External
import React from "react";
import Immutable from "immutable";
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';

// --- Internal
import TaskTablePlayPause from './task_table_play_pause';
import TaskTableTagsList from "./task_table_tags_list";
import TaskTableActionMenu from "./task_table_action_menu";

// --- Styles {{{

const Style = {
  // Styles for the whole row <tr>
  Row: {
    height: 70,
  },
  // PlayPause Column
  PlayPause: {
    width: 48,
  },
  // Deadline Column
  Deadline: {
    width: 100,
  },
  // Time Spent Column
  TimeSpent: {
    width: 80,
  },
  // Action Menu Column
  Actions: {
    width: 48,
  },
}

// --- }}}

const TaskTableRow = React.createClass({
  propTypes: {
    task: React.PropTypes.instanceOf(Immutable.Record).isRequired,
    actionCreator: React.PropTypes.object.isRequired,
  },

  getDefaultProps: function() {
    return {};
  },

  render: function() {
    const props = this.props;
    const task = this.props.task;
    const tags = props.task.tags;

    const tac = props.actionCreator;
    const startTask = tac.start.bind(tac, task.id);
    const stopTask = tac.stop.bind(tac, task.id);
    const complete = tac.complete.bind(tac, task.id);
    const makeGoal = tac.goal.bind(tac, task.id);
    const dropGoal = tac.dropGoal.bind(tac, task)
    const edit = tac.edit.bind(tac, task.id);
    const del = tac.delete.bind(tac, task.id);

    const rowClassName = (props.task.in_progress) ? "todo-in-progress" : "";

    return <TableRow className={rowClassName} style={Style.Row}>
            <TableRowColumn style={Style.PlayPause}>
                <TaskTablePlayPause on={props.task.in_progress} play={startTask} pause={stopTask} />
            </TableRowColumn>

            <TableRowColumn>
              {props.task.name}
              <TaskTableTagsList tags={tags} />
            </TableRowColumn>

            <TableRowColumn style={Style.Deadline}>
                {props.task.deadline_formatted}
            </TableRowColumn>

            <TableRowColumn style={Style.TimeSpent}>
                {props.task.time_spent}
            </TableRowColumn>

            <TableRowColumn style={Style.Actions}>
                <TaskTableActionMenu isGoal={props.task.is_goal} complete={complete} makeGoal={makeGoal} dropGoal={dropGoal} edit={edit} del={del} />
            </TableRowColumn>
        </TableRow>;
  },
});

export default TaskTableRow;
module.exports = TaskTableRow;

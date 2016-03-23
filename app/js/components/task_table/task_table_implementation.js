// --- Imports {{{

// --- External
import React from "react";
import Immutable from "immutable";
import LinearProgress from 'material-ui/lib/linear-progress';
import Paper from "material-ui/lib/paper";
import Table from "material-ui/lib/table/table";
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRow from 'material-ui/lib/table/table-row';
import TableBody from 'material-ui/lib/table/table-body';

// --- Internal
import TaskTableRow from "./task_table_row";

// --- }}}

// --- Styles {{{

const Style = {
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
  Progress: {
    margin: "200px auto",
    width: "500px"
  }
}

// --- }}}

const TaskTableImplementation = React.createClass({
  propTypes: {
    isLoading: React.PropTypes.bool.isRequired,
    tasks: React.PropTypes.instanceOf(Immutable.List).isRequired,
    actionCreator: React.PropTypes.object.isRequired,
  },

  render: function() {
    const props = this.props;

    switch (props.isLoading) {
      case false:
        const rows = props.tasks.map((task) => <TaskTableRow key={task.id} task={task} actionCreator={props.actionCreator}/>);

        return <Paper>
          <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn style={Style.PlayPause}></TableHeaderColumn>
                <TableHeaderColumn> Name </TableHeaderColumn>
                <TableHeaderColumn style={Style.Deadline}> Deadline </TableHeaderColumn>
                <TableHeaderColumn style={Style.TimeSpent}> Time Spent </TableHeaderColumn>
                <TableHeaderColumn style={Style.Actions}> </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
            {rows}
            </TableBody>
          </Table>
        </Paper>;
      case true:
      default:
        return <LinearProgress style={Style.Progress} mode="indeterminate"/>;
    }
  }
});

export default TaskTableImplementation;
module.exports = TaskTableImplementation;

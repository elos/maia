var React = require("react");

var LinearProgress = require('material-ui/lib/linear-progress');
var Paper = require("material-ui/lib/paper");
var Table = require("material-ui/lib/table/table");
var TableHeaderColumn =require( 'material-ui/lib/table/table-header-column');
var TableHeader=require( 'material-ui/lib/table/table-header');
var TableRow=require( 'material-ui/lib/table/table-row');
var TableBody =require( 'material-ui/lib/table/table-body');

var TaskTableRow = require("./task_table_row");

function TaskTableImplementation (props) {
    switch (props.isLoading) {
        case false:
            return (
                <Paper>
                    <Table>
                        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn style={{width: 48}}>
                                </TableHeaderColumn>
                                <TableHeaderColumn>
                                    Name
                                </TableHeaderColumn>
                                <TableHeaderColumn style={{width: 100}}>
                                    Deadline
                                </TableHeaderColumn>
                                <TableHeaderColumn style={{width: 80}}>
                                    Time Spent
                                </TableHeaderColumn>
                                <TableHeaderColumn style={{width: 48}}>
                                </TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {props.tasks.map(function(task) {
                                return ( <TaskTableRow key={task.id} task={task} /> );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            );
        case true:
        default:
            return ( <LinearProgress style={{margin: "200px auto", width: "500px"}} mode="indeterminate"/>);
    }
}

module.exports = TaskTableImplementation;

var React = require("react");

var TodosActionCreators = require("../../action-creators/todos-action-creators");

var TableRow =require( 'material-ui/lib/table/table-row');
var TableRowColumn =require( 'material-ui/lib/table/table-row-column');

var TaskTablePlayPause = require('./task_table_play_pause');
var TaskTableTagsList = require("./task_table_tags_list");
var TaskTableActionMenu = require("./task_table_action_menu");
var TaskTableRow = require("./task_table_row");

var TagStore = require("../../stores/tag-store");

function TaskTableRow(props) {
    return (
        <TableRow className={(todo.in_progress) ? "todo-in-progress":""} style={{height: 70}}>
            <TableRowColumn style={{width: 48}}>
                <TaskTablePlayPause
                    on={props.task.in_progress}
                    play={TodosActionCreators.start.bind(TodosActionCreators, task.id)}
                    pause={TodosActionCreators.stop.bind(TodosActionCreators, task.id)} />
            </TableRowColumn>
            <TableRowColumn>
            {props.task.name}
                <TaskTableTagsList
                tags={props.task.tags_ids.map(
                        function (id) {
                            return {id: id, name: TagStore.nameForID(id) };
                        })} />
            </TableRowColumn>
            <TableRowColumn style={{width: 100}}>
                {props.task.deadline_formatted}
            </TableRowColumn>
            <TableRowColumn style={{width: 80}}>
                {props.task.time_spent}
            </TableRowColumn>
            <TableRowColumn style={{width: 48}}>
                <TaskTableActionMenu task={props.task} />
            </TableRowColumn>
        </TableRow>
    )
}

module.exports = TaskTableRow;

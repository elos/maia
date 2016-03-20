/*
 * Require all third party libraries
 *
 * 1. `react` is required for `React.createClass`
 * 2/ `moment` is require for duration formatting
 */
var React = require("react");
var moment = require("moment");
var DatePicker = require('material-ui/lib/date-picker/date-picker');
var TextField = require("material-ui/lib/text-field");
var TimePicker = require('material-ui/lib/time-picker/time-picker');
var LinearProgress = require('material-ui/lib/linear-progress');
var List = require('material-ui/lib/lists/list');
var ListItem = require('material-ui/lib/lists/list-item');
var Checkbox = require('material-ui/lib/checkbox');
var Paper = require('material-ui/lib/paper');
var Card = require('material-ui/lib/card/card');
var CardTitle = require('material-ui/lib/card/card-title');
var FlatButton = require('material-ui/lib/flat-button');
var CardActions = require('material-ui/lib/card/card-actions');

/*
 * Require any local code we need, like stores, utils etc.
 */
var Logger = require("../utils/logger");
var CLIStore = require("../stores/cli-store");
var CLIActionCreator = require("../action-creators/cli-action-creator");
var RouteActionCreator = require("../action-creators/route-action-creator");
var RecordActionCreators = require("../action-creators/record-action-creators");
var TodosActions = require("../actions/todos-actions");
var TodosActionCreators = require("../action-creators/todos-action-creators");
var TodosStore = require("../stores/todos-store");
var TagActionCreators = require("../action-creators/tag-action-creators");
var TagStore = require("../stores/tag-store");
var MDL = require("../utils/mdl");
var SnackbarActionCreators = require("../action-creators/snackbar-action-creators.js");
var RouteStore = require("../stores/route-store");

/*
 * "Private" variables and functions can go here
 */
var Style = {
    Container: {
        background: "white",
        width: "70%",
        margin: "30px auto",
    },

    FormContainer: {
        display: "flex",
        flexDirection: "row",

        FormNavigation: {
            List: {
                paddingLeft: "0",
                listStyleType: "none",

                Item:  {
                    cursor: "pointer",
                    borderLeft: "2px solid grey",
                    padding: "3px 10px",
                },

                ItemSelected: {
                    color: "blue",
                    borderLeft: "2px solid blue",
                },
            },
        },

        Form: {
            display: "flex",
            flexDirection: "column",
            paddingLeft: 20,
        },
    },

    Input: {
        flex: 1,
    },

    Button: {
        float: "right",
    }
};

var TaskEditor = React.createClass({

    /*
     * Called once when the component is mounted
     */
    componentDidMount: function () {
        MDL.refresh();
        TodosStore.addChangeListener(this._todosChange);
        TagStore.addChangeListener(this._tagChange);
        TagActionCreators.issueRefresh();
        RouteStore.addChangeListener(this._routeChange);
    },

    /*
     * Called once when the component is unmounted
     */
    componentWillUnmount: function () {
        TodosStore.removeChangeListener(this._todosChange);
        TagStore.removeChangeListener(this._tagChange);
        RouteStore.removeChangeListener(this._routeChange);
    },

    _todosChange: function () {
        var target = TodosStore.getEditorTarget();

        var tasks = TodosStore.getTodos();
        if (tasks !== null) {
            tasks = tasks.filter(TodosStore.isCompleted);
        }

        if (target !== null && target.id) {
            tasks = tasks.filter(function (task) { return task.id !== target.id; });
        }

        this.setState({
            task: target,
            tasks: tasks,
        });
    },

    _tagChange: function () {
        this.setState({
            tags: TagStore.getAllTags(),
        });
    },

    _routeChange: function () {
        var id = RouteStore.getState("task_id");

        if (!id) {
            return;
        }

        console.log(id);

        if (id && (!this.state.task || !this.state.task.id || this.state.task.id.length === 0)) {
            RecordActionCreators.find('task', id, {
                success: function (record) {
                    TodosActions.editTask(record);
                }
            });
        }
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
        var id = RouteStore.getState("task_id");

        if (id) {
            RecordActionCreators.find('task', id, {
                success: function (record) {
                    Logger.info(record);
                    TodosActionCreators.edit(record);
                }
            });
        }

        var target = TodosStore.getEditorTarget();

        var tasks = TodosStore.getTodos();
        if (tasks !== null) {
            tasks = tasks.filter(TodosStore.isCompleted);
        }

        if (target !== null && target.id) {
            tasks = tasks.filter(function (task) { return task.id !== target.id; });
        }

        return {
            task: target,
            tags: TagStore.getAllTags(),
            tasks: tasks,
            navigation: "Basic",
        };
    },

    nameChange: function (event) {
        var t = this.state.task;
        t.name = event.target.value;
        this.setState({task: t});
    },

    deadlineChange: function (event) {
        var t = this.state.task;
        t.deadline = new Date(event.target.value);
        this.setState({task: t});
    },

    submit: function () {
        Logger.info(this.state);
        TodosActionCreators.save(this.state.task);
    },

    includeTag: function (tag) {
        var t = this.state.task;
        t.tags_ids = t.tags_ids || [];

        if (t.tags_ids.indexOf(tag.id) === -1) {
            t.tags_ids.push(tag.id);
        } else {
            return;
        }

        this.setState({
            task: t,
        });
    },

    excludeTag: function (tag) {
        var t = this.state.task;
        t.tags_ids = t.tags_ids || [];
        t.tags_ids = t.tags_ids.filter(function (t_id) {
            return t_id !== tag.id;
        });

        this.setState({
            task: t,
        });
    },

    includePrerequisite: function (task) {
        var t = this.state.task;
        t.prerequisites_ids = t.prerequisites_ids || [];

        if (t.prerequisites_ids.indexOf(task.id) === -1) {
            t.prerequisites_ids.push(task.id);
        } else {
            return;
        }

        this.setState({
            task: t,
        });
    },

    excludePrerequisite: function (task) {
        var t = this.state.task;
        t.prerequisites_ids = t.prerequisites_ids || [];
        t.prerequisites_ids = t.prerequisites_ids.filter(function (t_id) {
            return t_id !== task.id;
        });

        this.setState({
            task: t,
        });
    },

    newDeadlineDate: function(_, newDate) {
        if (this.state.task.deadline) {
            newDate.setHours(this.state.task.deadline.getHours());
            newDate.setMinutes(this.state.task.deadline.getMinutes());
        }

        var t = Object.assign({}, this.state.task);
        t.deadline = newDate;

        this.setState({
            task: t,
        });
    },

    newDeadlineTime: function(_, newTime) {
        var t = Object.assign({}, this.state.task);
        t.deadline.setHours(newTime.getHours());
        t.deadline.setMinutes(newTime.getMinutes());
        this.setState({
            task: t,
        });
    },
        // --- render {{{

    /*
     * Called every time the state changes
     */
    render: function () {
        var TaskEditor = this;

        var Basic = (
               <div style={Style.FormContainer.Form}>
                   <TextField
                       floatingLabelText="Name..."
                       value={this.state.task.name}
                       onChange={this.nameChange}
                   />
                   <DatePicker
                       minDate={new Date()}
                       value={this.state.task.deadline}
                       onChange={this.newDeadlineDate}
                       hintText="Deadline Date"
                    />
                    <TimePicker
                       value={this.state.task.deadline}
                       onChange={this.newDeadlineTime}
                       hintText="Deadline Time"
                    />
                </div>
            );

        var Tags;

        if (this.state.tags === null) {
            Tags = (
                <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
            );
        } else {
            Tags = (
               <div style={Style.FormContainer.Form}>
                   <List>
                   {this.state.tags.map(function (tag) {
                       return (
                           <ListItem
                               leftCheckbox={<Checkbox onClick={function() {
                                   if (TaskEditor.state.task.tags_ids && TaskEditor.state.task.tags_ids.indexOf(tag.id) >= 0) {
                                       TaskEditor.excludeTag(tag);
                                   } else {
                                       TaskEditor.includeTag(tag);
                                   }
                               }}
                               checked={TaskEditor.state.task.tags_ids && TaskEditor.state.task.tags_ids.indexOf(tag.id) >= 0}
                               />}
                               primaryText={tag.name}
                               key={tag.id}
                           />
                        )
                   })}
                   </List>
               </div>
            );
        }

        var Prereqs;

        if (this.state.tasks === null) {
            Prereqs = (
                <LinearProgress mode="indeterminate"/>
            );
        } else {
            Prereqs = (
               <div style={Style.FormContainer.Form}>
                   <List>
                   {this.state.tasks.map(function (task) {
                       return (
                           <ListItem
                               leftCheckbox={<Checkbox onClick={function() {
                                   if (TaskEditor.state.task.prerequisites_ids && TaskEditor.state.task.prerequisites_ids.indexOf(task.id) >= 0) {
                                       TaskEditor.excludePrerequisite(task);
                                   } else {
                                       TaskEditor.includePrerequisite(task);
                                   }
                               }}
                               checked={TaskEditor.state.task.prerequisites_ids && TaskEditor.state.task.prerequisites_ids.indexOf(task.id) >= 0}
                               />}
                               primaryText={task.name}
                               key={task.id}
                           />
                        )
                   })}
                   </List>
                </div>
            );
        }


        var Navigation = {
            "Basic": {
                JSX: Basic,
                Click: function () {
                    TaskEditor.setState({
                        navigation: "Basic",
                    });
                }
            },
            "Tags": {
                JSX: Tags,
                Click: function () {
                    TaskEditor.setState({
                        navigation: "Tags",
                    })
                }
            },
            "Prereqs": {
                JSX: Prereqs,
                Click: function () {
                    TaskEditor.setState({
                        navigation: "Prereqs",
                    });
                }
            },
        };

        var NavigationKeys = ["Basic", "Tags", "Prereqs"];

        var navigation = this.state.navigation || "Basic";

        var NavigationContent = Navigation[navigation];

        return (

                <Card style={Style.Container} zDepth={1}>
                    <div>
                    <CardTitle title={function (task) {
                        if (task === null) {
                            return "";
                        }

                        if (!task.id) {
                            if (task.name && task.name.length > 0) {
                                return "New Task: \"" + task.name + "\"";
                            } else {
                                return "New Task";
                            }
                        } else {
                            if (task.name && task.name.length > 0) {
                                return "Editing Task: \"" + task.name + "\"";
                            } else {
                                return "Editing Task";
                            }
                        }
                     }(this.state.task)}
                    />

                   <div style={Style.FormContainer}>
                        <div style={Style.FormContainer.FormNavigation}>
                            <ul style={Style.FormContainer.FormNavigation.List}>
                                {NavigationKeys.map(function (key) {
                                   return (
                                           <li key={key}
                                               style={
                                                   function () {
                                                       if (navigation === key) {
                                                           var style = Style.FormContainer.FormNavigation.List.ItemSelected;
                                                           for (k in Style.FormContainer.FormNavigation.List.Item) {
                                                               if (!style[k]) {
                                                                   style[k] = Style.FormContainer.FormNavigation.List.Item[k];
                                                               }
                                                           }
                                                           return style;
                                                       } else {
                                                           return Style.FormContainer.FormNavigation.List.Item;
                                                       }
                                                   }()
                                               }
                                               onClick={Navigation[key].Click}>
                                               {key}
                                           </li> );
                                })}
                            </ul>
                        </div>
                        {NavigationContent.JSX}
                    </div>

                    <CardActions>
                        {function() {
                            if (TaskEditor.state.task.id && false) {
                                return (<span>
                                    <FlatButton label="Start" onTouchStart={TaskEditor.start}/>
                                    <FlatButton label="Complete" onTouchStart={TaskEditor.complete}/>
                                    <FlatButton label="Make Goal" onTouchStart={TaskEditor.goal}/>
                                </span>);
                            } else {
                                return (<span></span>);
                            }
                        }()}
                        <FlatButton label="Save" onClick={TaskEditor.submit} onTouchStart={TaskEditor.submit} />
                    </CardActions>
                </div>
                </Card>
        );
    },

    // --- }}}

    start: function () {
    },

    stop: function () {
    },

    complete: function () {
    },

    goal: function () {
    },

    /*
     * Private functions
     */
})


module.exports = TaskEditor;

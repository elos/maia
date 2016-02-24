/*
 * Require all third party libraries
 *
 * 1. `react` is required for `React.createClass`
 * 2/ `moment` is require for duration formatting
 */
var React = require("react");
var moment = require("moment");

/*
 * Require any local code we need, like stores, utils etc.
 */
var Logger = require("../utils/logger");
var CLIStore = require("../stores/cli-store");
var CLIActionCreator = require("../action-creators/cli-action-creator");
var RouteActionCreator = require("../action-creators/route-action-creator");
var TodosActionCreators = require("../action-creators/todos-action-creators");
var TodosStore = require("../stores/todos-store");
var TagActionCreators = require("../action-creators/tag-action-creators");
var TagStore = require("../stores/tag-store");
var MDL = require("../utils/mdl");
var SnackbarActionCreators = require("../action-creators/snackbar-action-creators.js");

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
    },

    /*
     * Called once when the component is unmounted
     */
    componentWillUnmount: function () {
        TodosStore.removeChangeListener(this._todosChange);
        TagStore.removeChangeListener(this._tagChange);
    },

    _todosChange: function () {
        this.setState({
            task: TodosStore.getEditorTarget(),
        });
    },

    _tagChange: function () {
        this.setState({
            tags: TagStore.getAllTags(),
        });
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
            task: TodosStore.getEditorTarget(),
            tags: TagStore.getAllTags(),
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


    /*
     * Called every time the state changes
     */
    render: function () {
        Logger.info("RENDER", this.state.task);
        var TaskEditor = this;
        var Basic = (
               <div style={Style.FormContainer.Form}>
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style={Style.Input}>
                        <input className="mdl-textfield__input"
                               type="text"
                               id="name"
                               value={this.state.task.name}
                               onChange={this.nameChange} />
                        <label className="mdl-textfield__label" htmlFor="name">Name...</label>
                    </div>
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style={Style.Input}>
                        <input className="mdl-textfield__input"
                               type="date"
                               id="deadline-date"
                               value={(this.state.task.deadline) ? moment(this.state.task.deadline).format("YYYY-MM-DD") : ""}
                               onChange={this.deadlineDateChange} />
                        <label className="mdl-textfield__label" htmlFor="deadline-date">Deadline Date...</label>
                    </div>
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style={Style.Input}>
                        <input className="mdl-textfield__input"
                               type="time"
                               id="deadline-time"
                               value={(this.state.task.deadline) ? moment(this.state.task.deadline).format("HH:MM") : ""}
                               onChange={this.deadlineTimeChange} />
                        <label className="mdl-textfield__label" htmlFor="deadline-time">Deadline Time...</label>
                    </div>
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
                {this.state.tags.map(function (tag) {
                    return (
                            <div key={tag.id}>
                                <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={tag.id}>
                                <span className="mdl-checkbox__label">{tag.name}</span>
                                {function () {
                                    if (TaskEditor.state.task.tags_ids && TaskEditor.state.task.tags_ids.indexOf(tag.id) >= 0) {
                                        return (<input type="checkbox" id={tag.id} className="mdl-checkbox__input" checked onClick={TaskEditor.excludeTag.bind(TaskEditor, tag)} />);
                                    } else {
                                        return (<input type="checkbox" id={tag.id} className="mdl-checkbox__input" onClick={TaskEditor.includeTag.bind(TaskEditor, tag)} />);
                                    }
                                 }()}
                                </label>
                            </div>
                            );
                    })
                }
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
            }
        };

        var NavigationKeys = ["Basic", "Tags"];

        var navigation = this.state.navigation || "Basic";

        var NavigationContent = Navigation[navigation];

        return (
            <div id="task-editor" className="mdl-card mdl-shadow--2dp" style={Style.Container}>
                <div className="mdl-card__title">
                    <h2 className="mdl-card__title-text">Task Editor</h2>
                </div>
               <div className="mdl-card__supporting-text" style={Style.FormContainer}>
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
                <div className="mdl-card__actions mdl-card--border">
                    {function() {
                        if (TaskEditor.state.task.id && false) {
                            return (<span>
                                <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                                   onClick={TaskEditor.start}>
                                    Start
                                </a>
                                <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                                   onClick={TaskEditor.complete}>
                                    Complete
                                </a>
                                <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                                   onClick={TaskEditor.goal}>
                                    Make Goal
                                </a>
                            </span>);
                        } else {
                            return (<span></span>);
                        }
                    }()}
                    <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                       onClick={this.submit}
                        style={Style.Button}>
                        Save
                    </a>
                </div>
            </div>
        );
    },

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

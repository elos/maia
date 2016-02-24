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
var MDL = require("../utils/mdl");
var SnackbarActionCreators = require("../action-creators/snackbar-action-creators.js");
var TaskTable = require("./task-table");
var TaskEditor = require("./task-editor");
var RouteStore = require("../stores/route-store");
var Routes = require("../constants/route-constants");

/*
 * "Private" variables and functions can go here
 */
var States = {
    Loading: 0,
    Listing: 1,
    Editing: 2,
};

var Todos = React.createClass({

    /*
     * Called once when the component is mounted
     */
    componentDidMount: function () {
        RouteStore.addChangeListener(this._onRouteChange);
        TodosActionCreators.refresh();
        MDL.refresh();
    },

    /*
     * Called once when the component is unmounted
     */
    componentWillUnmount: function () {
        RouteStore.removeChangeListener(this._onRouteChange);
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
            state: this._stateForRoute(RouteStore.getCurrentRoute()),
        };
    },

    backClicked: function () {
        RouteActionCreator.ShowTodos();
    },

    /*
     * Called every time the state changes
     */
    render: function () {
        var Todos = this;
        var SubComponent = TaskTable;

        if (this.state.state === States.Editing) {
            SubComponent = TaskEditor;
        }

        return (
            <div id="todos-container">
                <div id="todos-header">
                    {function () {
                        if (Todos.state.state === States.Editing) {
                            return (
                                <span>
                                    <button id="back-list-button" style={{marginLeft: 10}}
                                            className="mdl-button mdl-js-button mdl-button--icon"
                                            onClick={Todos.backClicked}>
                                        <i className="material-icons">keyboard_arrow_left</i>
                                    </button>
                                    <div className="mdl-tooltip" htmlFor="back-list-button">
                                        Back to Tasks
                                    </div>
                                </span>
                            );
                        }
                     }()}
                    <h2 id="todos-title"> Todos </h2>
                    {function () {
                        if (Todos.state.state !== States.Editing) {
                            return (
                                <span>
                                    <button id="add-task-button" style={{marginRight: 10}}
                                            className="mdl-button mdl-js-button mdl-button--icon"
                                            onClick={TodosActionCreators.create}>
                                        <i className="material-icons">add</i>
                                    </button>
                                    <div className="mdl-tooltip" htmlFor="add-task-button">
                                        New Task
                                    </div>
                                </span>
                            );
                        }
                     }()}
                </div>
                <SubComponent />
            </div>
        );
    },

    /*
     * Private functions
     */
    _onRouteChange: function () {
        this.setState({state: this._stateForRoute(RouteStore.getCurrentRoute())});
    },

    _stateForRoute: function () {
        switch (RouteStore.getCurrentRoute()) {
            case Routes.Todos:
                return States.Listing;
                break;
            case Routes.TodosEditor:
                return States.Editing;
                break;
            default:
                return States.Loading;
                break;
        }
    },
})

module.exports = Todos;


/*
 * Require all third party libraries
 *
 * 1. `react` is required for `React.createClass`
 */
var React = require("react");

/*
 * Require any local code we need, like stores, utils etc.
 */
var RouteStore = require("../stores/route-store");
var SnackbarStore = require("../stores/snackbar-store");
var RouteConstants = require("../constants/route-constants");
var SnackbarActionCreators = require("../action-creators/snackbar-action-creators");

var Logger = require("../utils/logger");
var MDL = require("../utils/mdl");

var Header = require("../components/header");
var CLI = require("../components/cli");
var Todos = require("../components/todos");
var AccountDetails = require("../components/account_details");
var Map = require("../components/map");

/*
 * "Private" variables and functions can go here
 */

var Root = React.createClass({
    /*
     * Called once when the component is mounted
     */
    componentDidMount: function () {
        /*
         * Tell the RouteStore we want to know about changes,
         */
        RouteStore.addChangeListener(this._onRouteChange);
        SnackbarStore.addChangeListener(this._onSnackbarChange);
    },

    /*
     * Called once when the component is unmounted
     */
    componentWillUnmount: function () {
        RouteStore.removeChangeListener(this._onRouteChange);
        SnackbarStore.removeChangeListener(this._onSnackbarChange);
    },

    /*
     * Called once before componentDidMount to set the initial component state.
     */
    getInitialState: function () {
        return {
            currentRoute: RouteStore.getCurrentRoute(),
            snack: null,
        };
    },

    /*
     * Called every time the state changes
     */
    render: function () {
        var Component;

        switch (this.state.currentRoute) {
            case RouteConstants.CLI:
                Component = CLI;
                break;
            case RouteConstants.AccountDetails:
                Component = AccountDetails;
                break;
            case RouteConstants.Todos:
            case RouteConstants.TodosEditor:
                Component = Todos;
                break;
            case RouteConstants.Map:
                Component = Map;
                break;
            default:
                Component = CLI;
                break;
        }


        var state = this.state;
        if (this.state.snack !== null) {
            // dismiss cause we are gonna show it
            setTimeout(function () {
                SnackbarActionCreators.dismissSnack(state.snack);
            }, this.state.snack.timeout);

            MDL.showSnack("#root-snackbar", this.state.snack);
        }
        /*
                <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                    <header className="mdl-layout__header">
                    <div className="mdl-layout__header-row">
                    <span className="mdl-layout-title">Title</span>
                    <div className="mdl-layout-spacer"></div>
                    <nav className="mdl-navigation">
                    <a className="mdl-navigation__link" href="">Link</a>
                    <a className="mdl-navigation__link" href="">Link</a>
                    <a className="mdl-navigation__link" href="">Link</a>
                    <a className="mdl-navigation__link" href="">Link</a>
                    </nav>
                    </div>
                    </header>
                    <div className="mdl-layout__drawer">
                    <span className="mdl-layout-title">Title</span>
                    <nav className="mdl-navigation">
                    <a className="mdl-navigation__link" href="">Link</a>
                    <a className="mdl-navigation__link" href="">Link</a>
                    <a className="mdl-navigation__link" href="">Link</a>
                    <a className="mdl-navigation__link" href="">Link</a>
                    </nav>
                    </div>
                    <main className="mdl-layout__content">
                    </main>
                </div>
                */

        return (
                <div className="root">
                    <Header />
                    <Component />
                    <div id="root-snackbar" className="mdl-js-snackbar mdl-snackbar">
                        <div className="mdl-snackbar__text"></div>
                        <button className="mdl-snackbar__action" type="button"></button>
                    </div>
                    <div className="mdl-layout__drawer">
                        <span className="mdl-layout-title">Title</span>
                        <nav className="mdl-navigation">
                        <a className="mdl-navigation__link" href="">Link</a>
                        <a className="mdl-navigation__link" href="">Link</a>
                        <a className="mdl-navigation__link" href="">Link</a>
                        <a className="mdl-navigation__link" href="">Link</a>
                        </nav>
                    </div>
                </div>
               )
    },

    /*
     * Private functions
     */
    _onRouteChange: function () {
        this.setState({
            currentRoute: RouteStore.getCurrentRoute()
        });
    },

    _onSnackbarChange: function () {
        if (SnackbarStore.hasSnacks()) {
            this.setState({
                snack: SnackbarStore.getOne(),
            });
        } else {
            this.setState({
                snack: null,
            });
        }
    },

});

module.exports = Root;

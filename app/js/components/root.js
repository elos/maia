
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
var RouteConstants = require("../constants/route-constants");

var AccountDetails = require("../components/account_details");
var Home = require("../components/home");
var CLI = require("../components/cli");
var Header = require("../components/header");
var Logger = require("../utils/logger");
var Todos = require("../components/todos");

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
    },

    /*
     * Called once when the component is unmounted
     */
    componentWillUnmount: function () {
        RouteStore.removeChangeListener(this._onRouteChange);
    },

    /*
     * Called once before componentDidMount to set the initial component state.
     */
    getInitialState: function () {
        return {
            currentRoute: RouteStore.getCurrentRoute()
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
                Component = Todos;
                break;
            default:
                Component = Home;
                break;
        }

        return (
                <div class="root">
                <Header />
                <Component />
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
    }

});

module.exports = Root;

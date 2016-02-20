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
var RouteActionCreator = require("../action-creators/route-action-creator");
var Logger = require("../utils/logger");

/*
 * "Private" variables and functions can go here
 */

var Header = React.createClass({

    /*
     * Called once when the component is mounted
     */
    componentDidMount: function () {
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
            currentRoute: RouteStore.getCurrentRoute(),
        };
    },

    selectTab: function(tabName) {
        switch (this._TabNames[tabName]) {
            case RouteConstants.AccountDetails:
                RouteActionCreator.ShowAccountDetails();
                break;
            case RouteConstants.CLI:
                RouteActionCreator.ShowCLI();
                break;
            case RouteConstants.Todos:
                RouteActionCreator.ShowTodos();
                break;
        }
    },

    /*
     * Called every time the state changes
     */
    render: function () {
        var tabs = ['CLI', 'Todos', 'Account'];
        var classes = tabs.map(this._isSelected);
        var header = this;

        return (
            <div className="header">
             <div className="logo"> ELOS </div>
             <div className="tabs">
                {tabs.map(function(tab, i) {
                    return <div key={tab} className={classes[i]}
                    onClick={header.selectTab.bind(header, tab)}
                    > {tab} </div>
                })}
                </div>
            </div>
        );
    },

    /*
     * Private functions
     */
    _onRouteChange: function () {
        this.setState({
            currentRoute: RouteStore.getCurrentRoute(),
        });
    },

    _TabNames: {
        "Account": RouteConstants.AccountDetails,
        "CLI": RouteConstants.CLI,
        "Todos": RouteConstants.Todos,
    },

    _isSelected: function(tabName) {
        if (this._TabNames[tabName] == this.state.currentRoute) {
            return "tab-selected mdl-button mdl-button-js mdl-js-ripple-effect";
        } else {
            return "tab mdl-button mdl-button-js mdl-js-ripple-effect";
        }
    }

});

module.exports = Header;

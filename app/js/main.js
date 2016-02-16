/*
 * Require all third party modules
 */
var React = require("react");
var ReactDOM = require("react-dom");

/*
 * Require all modules we built
 */
var Constants = require("./constants/app-constants");
var Dispatcher = require("./dispatcher/app-dispatcher");

/*
 * Initialize all application modules/stores below
 */
require("./stores/log-store");
require("./stores/tick-store");

var Home = require("./components/account_details");

Dispatcher.dispatch({
    actionType: Constants.APP_INITIALIZED
});

/*
 * Initialize React Below
 */
ReactDOM.render(
    <Home />,
    document.getElementById("react-app")
)

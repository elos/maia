/*
 * Require all third party modules
 */
var React = require("react");
var ReactDOM = require("react-dom");
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

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

var Root = require("./components/root");
var DB = require("./core/db");
var RecordActions = require("./actions/record-actions");

require("./stores/geolocation-store");

Dispatcher.dispatch({
    actionType: Constants.APP_INITIALIZED
});

DB.changes({
    error: function () {console.log("yikes");},
    resolve: function (recordChange) {
        switch (recordChange.change_kind) {
            case DB.ChangeKind.Update:
                RecordActions.update(recordChange.record_kind, recordChange.record);
                break;
            case DB.ChangeKind.Delete:
                RecordActions.delete(recordChange.record_kind, recordChange.record);
                break;
        }
    },
});

/*
 * Initialize React Below
 */
ReactDOM.render(
    <Root />,
    document.getElementById("react-app")
)

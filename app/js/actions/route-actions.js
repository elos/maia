var AppDispatcher = require("../dispatcher/app-dispatcher");
var AppConstants = require("../constants/app-constants");

var RouteActions = {
    changeTo: function (route) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ROUTE_CHANGE,
            data: {
                newRoute: route,
            }
        });
    },

    addState: function (key, value) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ROUTE_STATE_ADD,
            data: {
                key: key,
                value: value,
            }
        });
    }
};

module.exports = RouteActions;

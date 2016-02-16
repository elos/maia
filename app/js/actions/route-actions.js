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
    }
};

module.exports = RouteActions;

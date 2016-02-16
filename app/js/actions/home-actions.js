var AppDispatcher = require("../dispatcher/app-dispatcher");
var AppConstants = require("../constants/app-constants");

var HomeActions = {
    generateTick: function (session) {
        AppDispatcher.dispatch({
            actionType: AppConstants.TICK_GENERATED
        });
    }
};

module.exports = HomeActions;

var AppDispatcher = require("../dispatcher/app-dispatcher");
var AppConstants = require("../constants/app-constants");

var SnackbarActions = {

    add: function (snackData) {
        AppDispatcher.dispatch({
            actionType: AppConstants.SNACKBAR_ADD,
            data: snackData,
        });
    },

    drop: function (snack) {
        AppDispatcher.dispatch({
            actionType: AppConstants.SNACKBAR_DROP,
            data: {
                snack: snack,
            },
        });
    },

};

module.exports = SnackbarActions;

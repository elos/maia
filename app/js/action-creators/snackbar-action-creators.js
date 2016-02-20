var SnackbarActions = require("../actions/snackbar-actions");
var AppConstants = require ("../constants/app-constants");

var RouteActionCreators = {

    showMessage: function (message, options) {
        options = options || {};

        SnackbarActions.add({
            message: message,
            actionText: options.actionText,
            actionHandler: options.actionHandler,
            timeout: options.timeout,
        });
    },

    dismissSnack: function (snack) {
        SnackbarActions.drop(snack);
    }

};

module.exports = RouteActionCreators;

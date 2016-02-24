var AppDispatcher = require("../dispatcher/app-dispatcher");
var AppConstants = require("../constants/app-constants");

var ConfigActions = {
    update: function (publicCredential, privateCredential) {
        AppDispatcher.dispatch({
            actionType: AppConstants.CONFIG_UPDATE,
            data: {
                publicCredential: publicCredential,
                privateCredential: privateCredential
            }
        });
    },

    setHost: function (host) {
        AppDispatcher.dispatch({
            actionType: AppConstants.CONFIG_SET_HOST,
            data: {
                host: host,
            }
        });
    }
};

module.exports = ConfigActions;

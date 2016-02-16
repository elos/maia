/*
 * Node's EventEmitter + object-assign
 */
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");

/*
 * Require our own modules
 */
var AppDispatcher = require("../dispatcher/app-dispatcher");
var AppConstants = require("../constants/app-constants");

var Logger = require("../utils/logger");
var Cookies = require("../utils/cookies");

/*
 * "Private" variables and functions can go here
 */
var PublicCredentialKey = "public-credential";
var PrivateCredentialKey = "private-credential";

/*
 * ConfigStore
 *  - Stores elos user config
 */
var ConfigStore = assign({}, EventEmitter.prototype, {
    getPublicCredential: function () {
        var stored = Cookies.get(PublicCredentialKey);

        if (stored === null) {
            return "";
        }

        return stored;
    },

    getPrivateCredential: function () {
        var stored = Cookies.get(PrivateCredentialKey);

        if (stored === null) {
            return "";
        }

        return stored;
    },

    setPublicCredential: function (cred) {
        Cookies.set(PublicCredentialKey, cred);
    },

    setPrivateCredential: function (cred) {
        Cookies.set(PrivateCredentialKey, cred);
    },

    setCredentials: function (pubCred, priCred) {
        Logger.info("ConfigStore: setting credentials");
        this.setPublicCredential(pubCred);
        this.setPrivateCredential(priCred);
    }

});

/*
 * Register all event callbacks
 */
AppDispatcher.register(function (action) {
    Logger.info(action);
    switch (action.actionType) {
        case AppConstants.CONFIG_UPDATE:
            ConfigStore.setCredentials(action.data.publicCredential,
                    action.data.privateCredential);
            break;
    }
});


module.exports = ConfigStore;

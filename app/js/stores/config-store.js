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
var Cookies = require("../utils/cookies");

/*
 * "Private" variables and functions can go here
 */
var PublicCredentialKey = "public-credential";
var PrivateCredentialKey = "private-credential";
var ConfigStoreEvents = {
    Changed: "changed"
};

/*
 * ConfigStore: stores and manages elos user configuration
 */
var ConfigStore = assign({}, EventEmitter.prototype, {

    // --- Eventing (Changed) {{{
    emitChange: function () {
        this.emit(ConfigStoreEvents.Changed);
    },

    addChangeListener: function (callback) {
        this.on(ConfigStoreEvents.Changed, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(ConfigStoreEvents.Changed, callback);
    },
    // --- }}}

    // --- Accessors (getPublicCredential, getPrivateCredential) {{{
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

    // --- }}}

    // -- Private Methods (_setPublicCredential, _setPrivateCredential, _setCredentials) {{{
    _setPublicCredential: function (cred) {
        Cookies.set(PublicCredentialKey, cred);
    },

    _setPrivateCredential: function (cred) {
        Cookies.set(PrivateCredentialKey, cred);
    },

    _setCredentials: function (pubCred, priCred) {
        this._setPublicCredential(pubCred);
        this._setPrivateCredential(priCred);
        this.emitChange();
    }
    // --- }}}

});

/*
 * Register all event callbacks
 */
ConfigStore.dispatchToken = AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case AppConstants.APP_INITIALIZED:
            ConfigStore.emitChange();
            break;
        case AppConstants.CONFIG_UPDATE:
            ConfigStore._setCredentials(
                    action.data.publicCredential,
                    action.data.privateCredential
            );
            break;
    }
});


module.exports = ConfigStore;

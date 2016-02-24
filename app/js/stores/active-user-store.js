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
var ConfigStore = require("./config-store");
var RecordStore = require("./record-store");
var RecordActionCreators = require("../action-creators/record-action-creators");
var Logger = require("../utils/logger");

/*
 * "Private" variables and functions can go here
 */
var ActiveUserStoreEvents = {
    Changed: "changed"
};

/*
 * ActiveUserStore: stores and manages elos user
 */
var ActiveUserStore = assign({}, EventEmitter.prototype, {

    // --- Eventing (Changed) {{{
    emitChange: function () {
        this.emit(ActiveUserStoreEvents.Changed);
    },

    addChangeListener: function (callback) {
        this.on(ActiveUserStoreEvents.Changed, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(ActiveUserStoreEvents.Changed, callback);
    },
    // --- }}}

    // --- Accessors (getID) {{{
    getID: function () {
        var users = RecordStore.getAll('user');

        if (users.length === 0) {
            return "";
        }

        var u = users[0];

        if (u === null) {
            return "";
        }

        return u.id;
    },
    // --- }}}

    // -- Private Methods () {{{
    _initialize: function () {
        ConfigStore.addChangeListener(ActiveUserStore._configChange);
        this._configChange();
    },

    _configChange: function () {
        var ActiveUserStore = this;

        RecordActionCreators.query("user", {}, {
            success: function () {
                ActiveUserStore.emitChange();
            },
            error: function () {
                Logger.info("[ERROR]: ActiveUserStore._configChange query");
            }
        });
    },
    // --- }}}

});

/*
 * Register all event callbacks
 */
ActiveUserStore.dispatchToken = AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case AppConstants.APP_INITIALIZED:
            AppDispatcher.waitFor([ConfigStore.dispatchToken, RecordStore.dispatchToken]);
            ActiveUserStore._initialize();
            break;
        default:
            break;
    }
});

module.exports = ActiveUserStore;

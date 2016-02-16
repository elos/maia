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
var RouteConstants = require("../constants/route-constants");

var Logger = require("../utils/logger");

/*
 * "Private" variables and functions can go here
 */

var RouteStoreEvents = {
    Changed: "changed"
};

/*
 * ConfigStore
 *  - Stores elos user config
 */
var RouteStore = assign({}, EventEmitter.prototype, {
    // --- Eventing {{{
    emitChange: function () {
        this.emit(RouteStoreEvents.Changed);
    },

    addChangeListener: function (callback) {
        this.on(RouteStoreEvents.Changed, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(RouteStoreEvents.Changed, callback);
    },
    // --- }}}

    _route: RouteConstants.CLI,

    getCurrentRoute: function() {
        return this._route;
    },

    changeRouteTo: function(r) {
        this._route = r;
        this.emitChange();
    }
});

/*
 * Register all event callbacks
 */
AppDispatcher.register(function (action) {
    Logger.info(action);
    switch (action.actionType) {
        case AppConstants.ROUTE_CHANGE:
            RouteStore.changeRouteTo(action.data.newRoute);
            break;
    }
});


module.exports = RouteStore;

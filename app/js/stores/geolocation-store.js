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
var ActiveUserStore = require("../stores/active-user-store");
var RecordActionCreators = require("../action-creators/record-action-creators");
var Logger = require("../utils/logger");

/*
 * Private variables and functions can go here
 */

var GeolocationStoreEvents = {
    Change: "change",
};


/*
 * GeolocationStore
 *  - Updates user's location using browser's geolocation
 */
var GeolocationStore = assign({}, EventEmitter.prototype, {

    // --- Eventing (Changed) {{{
    emitChange: function () {
        this.emit(GeolocationStoreEvents.Changed);
    },

    addChangeListener: function (callback) {
        this.on(GeolocationStoreEvents.Changed, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(GeolocationStoreEvents.Changed, callback);
    },
    // --- }}}

    _location: null,

    getPosition: function () {
        return this._location;
    },

    initialize: function () {
        if (!navigator.geolocation) {
            Logger.info("no geolocation");
            return;
        }

        navigator.geolocation.watchPosition(this._pushLocation);
    },

    // geoposition ~ {coords: { latitude, longitude }}
    _pushLocation: function (geoposition) {
        GeolocationStore._location = {
            latitude: geoposition.coords.latitude,
            longitude: geoposition.coords.longitude,
        };

        var userID = ActiveUserStore.getID();

        if (userID.length > 0) {
            RecordActionCreators.save(
                    'event',
                    {
                        "name": "WEB_SENSOR_LOCATION",
                        "owner_id": ActiveUserStore.getID(),
                        "data": GeolocationStore._location,
                    }
            );
        }

        GeolocationStore.emitChange();
    }
});

/*
 * Register all event callbacks
 */
GeolocationStore.dispatchToken = AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case AppConstants.APP_INITIALIZED:
            AppDispatcher.waitFor([ActiveUserStore.dispatchToken]);
            GeolocationStore.initialize();
            break;
    }
});

module.exports = GeolocationStore;

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

/*
 * Private variables and functions can go here
 */
var _ticksRemaining = 10;

var TickStoreEvents = {
    Changed: "changed"
};

/*
 * TickStore
 *  - Watches all events and prints them to the console.
 */
var TickStore = assign({}, EventEmitter.prototype, {

    emitChange: function () {
        this.emit(TickStoreEvents.Changed);
    },

    addChangeListener: function (callback) {
        this.on(TickStoreEvents.Changed, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(TickStoreEvents.Changed, callback);
    },

    getRemainingTicks: function () {
        return _ticksRemaining;
    },

    hasMoreTicks: function () {
        return _ticksRemaining > -1;
    },

});

/*
 * Register all event callbacks
 */
AppDispatcher.register(function (action) {
  switch (action.actionType) {
      case AppConstants.TICK_GENERATED:
          if (_ticksRemaining >= 0) {
            _ticksRemaining -= 1;
          }

          /*
           * Tell subscribers we have changed
           */
          TickStore.emitChange();
          break;

      default:
          /*
           * Do nothing
           */
      break;
  }
});

module.exports = TickStore;

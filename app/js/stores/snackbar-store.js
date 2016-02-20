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
 * "Private" variables and functions can go here
 */
var SnackbarStoreEvents = {
    Changed: "changed"
};

/*
 * Snackbar: stores and manages snacks to display in a snackbar, or notification
 * component
 */
var SnackbarStore = assign({}, EventEmitter.prototype, {

    // --- Eventing {{{

    emitChange: function () {
        this.emit(SnackbarStoreEvents.Changed);
    },

    addChangeListener: function (callback) {
        this.on(SnackbarStoreEvents.Changed, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(SnackbarStoreEvents.Changed, callback);
    },

    // --- }}}

    // --- Public Accessors (hasSnacks, numSnacks, getSnacks) {{{

    hasSnacks: function () {
        return this._snackCount > 0;
    },

    numSnacks: function () {
        return this._snackCount;
    },

    getOne: function () {
        var id;

        for (id in this._snacks) {
            if (this._snacks.hasOwnProperty(id)) {
                return this._snacks[id];
            }
        }

        return null;
    },

    getSnacks: function() {
        var snacks = [], id;
        for (id in this._snacks) {
            if (this._snacks.hasOwnProperty(id)) {
                snacks.push(this.snacks[id]);
            }
        }
        return snacks;
    },

    // --- }}}

    // --- Private (_snack, _snackCount, _initialize, _add, _drop, _guid) {{{

    // internal recollection of state
    _snacks: {},
    _snackCount: 0,

    // initialization
    _initialize: function () {
    },

    _add: function (data) {
        var id = this._guid();

        this._snacks[id] = {
            id: id,
            message: data.message,
            actionText: data.actionText,
            actionHandler: data.actionHandler,
            timeout: data.timeout,
        };

        this._snackCount += 1;

        this.emitChange();
    },

    _drop: function (snack) {
        delete this._snacks[snack.id];
        this._snackCount -= 1;

        this.emitChange();
    },

    _guid: function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },

    // --- }}}
});

/*
 * Register all event callbacks
 */
SnackbarStore.dispatchToken = AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case AppConstants.APP_INITIALIZED:
            SnackbarStore._initialize();
            break;
        case AppConstants.SNACKBAR_ADD:
            SnackbarStore._add(action.data);
            break;
        case AppConstants.SNACKBAR_DROP:
            SnackbarStore._drop(action.data.snack);
            break;
    }
});


module.exports = SnackbarStore;

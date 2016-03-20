/*
 * Node's EventEmitter + object-assign
 */
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var Immutable = require("immutable");

/*
 * Require our own modules
 */
var AppDispatcher = require("../dispatcher/app-dispatcher");
var AppConstants = require("../constants/app-constants");
var Logger = require("../utils/logger");
var Base64 = require("../utils/base64");
var record_reducer = require('./record/record_reducer');
var record_actions = require('./record/record_actions');
var record_derived = require('./record/record_derived');


/*
 * Private variables and functions can go here
 */
var _ticksRemaining = 10;

var RecordStoreEvents = {
    Update: "update",
    Delete: "delete",
    Change: "change",
    Push: "push",
    Pull: "pull",
    KindChange: "kind-change",
};

/*
 * RecordStore
 *  - Watches all record events and persists them to server.
 */
var RecordStore = assign({}, EventEmitter.prototype, {
    state: null,

    emitChange: function (changeType) {
        this.emit(changeType);
    },

    addChangeListener: function (callback) {
        this.on(RecordStoreEvents.Update, callback);
        this.on(RecordStoreEvents.Delete, callback);
        this.on(RecordStoreEvents.Change, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(RecordStoreEvents.Update, callback);
        this.removeListener(RecordStoreEvents.Delete, callback);
        this.removeListener(RecordStoreEvents.Change, callback);
    },

    emitKindChange: function (kind) {
        this.emit(RecordStoreEvents.KindChange+kind);
    },

    addKindChangeListener: function (callback, kind) {
        this.on(RecordStoreEvents.KindChange+kind, callback);
    },

    removeKindChangeListener: function (callback, kind) {
        this.removeListener(RecordStoreEvents.KindChange+kind, callback);
    },

    getAll: function(kind) {
        return record_derived.getAll(this.state, kind);
    },

    get: function (kind, id) {
        return record_derived.getOne(this.state, kind, id);
    },

    dispatch: function (action) {
        this.state = record_reducer(this.state, action);
        this.emitKindChange(action.data.kind);
        this.emit(RecordStoreEvents.Change);
    },
});

/*
 * Register all event callbacks
 */
RecordStore.dispatchToken = AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case AppConstants.RECORD_UPDATE:
            RecordStore.dispatch(record_actions.update(action.data.kind, action.data.record));
            break;
        case AppConstants.RECORD_DELETE:
            RecordStore.dispatch(record_actions.delete(action.data.kind, action.data.record));
            break;
    }
});

module.exports = RecordStore;

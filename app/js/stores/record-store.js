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
    records: {},
    state: null,
    _table: function (kind) {
        if (this.records[kind] === undefined) {
            this.records[kind] = {};
        }

        return this.records[kind];
    },

    initialize: function() {
        //this.state = record_reducer(this.state, AppConstants.APP_INITIALIZE);
    },

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
        var records = [];
        var bucket = RecordStore.records[kind];
            var id;

        if (bucket === undefined) {
            return records;
        }

        for (id in bucket) {
           if (bucket.hasOwnProperty(id)) {
               records.push(bucket[id]);
           }
        }

        return records;
    },

    get: function (kind, id) {
        var bucket =  this.records[kind];
        if (!bucket) {
            return null;
        }

        // cause this will be undefined I think, which isn't null
        return bucket[id] || null;
    },

      // merge two into one
    _merge: function(one, two) {
        var merge = {},
            key;
        for (key in one) {
           if (one.hasOwnProperty(key)) {
               merge[key] = one[key];
           }
        }

        for (key in two) {
           if (two.hasOwnProperty(key)) {
               merge[key] = two[key];
           }
        }

        return merge;
    },

    _pushRecord: function (kind, record) {
        RecordStore._table(kind)[record.id] = RecordStore._merge(RecordStore._table(kind)[record.id] || {}, record);
        this.emit(RecordStoreEvents.Push);
        this.emit(RecordStoreEvents.Change);
        this.emitKindChange(kind);
    },

    _pullRecord: function (kind, id) {
        delete RecordStore._table(kind)[id];
        this.emit(RecordStoreEvents.Pull);
        this.emit(RecordStoreEvents.Change);
        this.emitKindChange(kind);
    },

    dispatch: function (action) {
        this.state = record_reducer(this.state, action);
    },

});

/*
 * Register all event callbacks
 */
RecordStore.dispatchToken = AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case AppConstants.APP_INITIALIZED:
            RecordStore.initialize();
            break;
        case AppConstants.RECORD_UPDATE:
            RecordStore._pushRecord(action.data.kind, action.data.record);
            RecordStore.dispatch(record_actions.update(action.data.kind, action.data.record));
            break;
        case AppConstants.RECORD_DELETE:
            RecordStore._pullRecord(action.data.kind, action.data.record.id);
            RecordStore.dispatch(record_actions.delete(action.data.kind, action.data.record));
            break;
    }
});

module.exports = RecordStore;

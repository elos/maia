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
var ConfigStore = require("../stores/config-store");
var Logger = require("../utils/logger");
var Base64 = require("../utils/base64");

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
    host: "http://elos.pw",
    username: undefined,
    password: undefined,
    records: {},
    _table: function (kind) {
        if (this.records[kind] === undefined) {
            this.records[kind] = {};
        }

        return this.records[kind];
    },

    initialize: function() {
        ConfigStore.addChangeListener(this._configChanged);
        // update
        this._configChanged();
    },

    _configChanged: function () {
        RecordStore.username = ConfigStore.getPublicCredential();
        RecordStore.password = ConfigStore.getPrivateCredential();
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

    _encode: function (url, params) {
        var key;

        url = url + "?";
        for (key in params) {
           if (params.hasOwnProperty(key)) {
                  url = url + key + "=" + encodeURIComponent(params[key]) + "&";
            }
        }
        return url;
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
    }
});

/*
 * Register all event callbacks
 */
RecordStore.dispatchToken = AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case AppConstants.APP_INITIALIZED:
            AppDispatcher.waitFor([ConfigStore.dispatchToken]);
            RecordStore.initialize();
            break;
        case AppConstants.RECORD_UPDATE:
            RecordStore._pushRecord(action.data.kind, action.data.record);
            break;
        case AppConstants.RECORD_DELETE:
            RecordStore._pullRecord(action.data.kind, action.data.record.id);
            break;
    }
});

module.exports = RecordStore;

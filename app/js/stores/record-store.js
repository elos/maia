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
    Pull: "pull"
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

    _post: function(url, params, data, callback) {
        Logger.info("RecordStore._post");
        var xhr = new XMLHttpRequest();
        url = RecordStore._encode(url, params);
        xhr.open("POST", url, true, RecordStore.username, RecordStore.password);
        xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(RecordStore.username + ":" + RecordStore.password));
        //xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(xhr.status, xhr.responseText);
            }
        };
        xhr.send(JSON.stringify(data));
    },

    _delete: function(url, params, callback) {
        Logger.info("RecordStore._delete");
        var xhr = new XMLHttpRequest();

        xhr.open("DELETE", RecordStore._encode(url, params), true, RecordStore.username, RecordStore.password);
        //xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(xhr.status, xhr.responseText);
            }
        };

        xhr.send(null);
    },

    _get: function(url, params, callback) {
        Logger.info("RecordStore._get");
        var xhr = new XMLHttpRequest();

        xhr.open("GET", RecordStore._encode(url, params), true, RecordStore.username, RecordStore.password);
        //xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(xhr.status, xhr.responseText);
            }
        };

        xhr.send();
    },

    _find: function (kind, id) {
        Logger.info("RecordStore._find");
        RecordStore._get(
                RecordStore.host + "/record/",
                {
                    kind: kind,
                    id: id,
                },
                function (status, responseBody) {
                    if (status !== 200) {
                        Logger.info("ERROR: " + status + " " + responseBody);
                    }

                    var response = JSON.parse(responseBody);

                    RecordStore._merge(RecordStore.records[kind][response.id] || {}, response);
                    RecordStore.emitChange(RecordStoreEvents.Update);
                });
    },

    _save: function (kind, record) {
        Logger.info("RecordStore._save");
        RecordStore._post(
                RecordStore.host + "/record/",
                {
                    kind: kind,
                },
                record,
                function (status, responseBody) {
                    if (status !== 200 && status !== 201) {
                        Logger.info("ERROR: " + status + " " + responseBody);
                    }

                    var response = JSON.parse(responseBody);

                    RecordStore._merge(RecordStore.records[kind][response.id] || {}, response);
                    RecordStore.emitChange(RecordStoreEvents.Update);
                });
    },

    _remove: function (kind, record) {
        Logger.info("RecordStore._remove");
        RecordStore._delete(
                RecordStore.host + "/record/",
                {
                    kind: kind,
                    id: record.id,
                },
                record,
                function (status, responseBody) {
                    if (status !== 200) {
                        Logger.info("ERROR: " + status + " " + responseBody);
                    }

                    delete RecordStore.records[kind][record.id];
                    RecordStore.emitChange(RecordStoreEvents.Delete);
                });
    },

    _query: function (kind, attrs) {
        Logger.info("RecordStore._query");
        var params = attrs;
        params.kind = kind;
        RecordStore._post(
                RecordStore.host + "/record/query/",
                params,
                {},
                function (status, responseBody) {
                    if (status !== 200) {
                        Logger.info("ERROR: " + status + " " + responseBody);
                    }

                    var results = JSON.parse(responseBody),
                        i;

                    if (RecordStore.records[kind] === undefined) {
                        RecordStore.records[kind] = {};
                    }

                    for (i = 0; i < results.length; i++) {
                        RecordStore.records[kind][results[i].id] = RecordStore._merge(RecordStore.records[kind][results[i].id] || {}, results[i]);
                    }

                    RecordStore.emitChange(RecordStoreEvents.Update);
                });
    },

    _pushRecord: function (kind, record) {
        RecordStore.records[kind][record.id] = RecordStore._merge(RecordStore.records[kind][record.id] || {}, record);
        this.emit(RecordStoreEvents.Push);
        this.emit(RecordStoreEvents.Change);
    },

    _pullRecord: function (kind, id) {
        delete RecordStore.records[kind][id];
        this.emit(RecordStoreEvents.Pull);
        this.emit(RecordStoreEvents.Change);
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
            RecordStore._pullRecord(action.data.kind, action.data.id);
            break;
    }
});

module.exports = RecordStore;

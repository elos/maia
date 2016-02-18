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

/*
 * Private variables and functions can go here
 */
var _ticksRemaining = 10;

var RecordStoreEvents = {
    Update: "update",
    Delete: "delete",
};

var Base64 = {
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
                Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

        }

        return output;
    },

        // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = Base64._keyStr.indexOf(input.charAt(i++));
            enc2 = Base64._keyStr.indexOf(input.charAt(i++));
            enc3 = Base64._keyStr.indexOf(input.charAt(i++));
            enc4 = Base64._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

        // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "", n, c;

        for (n = 0; n < string.length; n++) {

            c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

        // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = 0,
            c2 =0,
            c3 =0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }
        return string;
    }
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
    },

    removeChangeListener: function (callback) {
        this.removeListener(RecordStoreEvents.Update, callback);
        this.removeListener(RecordStoreEvents.Delete, callback);
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
        case AppConstants.RECORD_GET:
            RecordStore._find(action.data.kind, action.data.id);
            break;
        case AppConstants.RECORD_UPDATE:
            RecordStore._save(action.data.kind, action.data.record);
            break;
        case AppConstants.RECORD_DELETE:
            RecordStore._remove(action.data.kind, action.data.record);
            break;
        case AppConstants.RECORD_QUERY:
            RecordStore._query(action.data.kind, action.data.attrs);
            break;
        default:
            /*
             * Do nothing
             */
            break;
    }
});

module.exports = RecordStore;

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
var Routes = require("../constants/route-constants");
var RecordStore = require("../stores/record-store");
var RecordActionCreators = require("../action-creators/record-action-creators");
var SnackbarActionCreators = require("../action-creators/snackbar-action-creators");
var RouteActionCreators = require("../action-creators/route-action-creator");
var Logger = require("../utils/logger");

var DB = require("../core/db");

/*
 * Private variables and functions can go here
 */
var TagStoreEvents = {
    Changed: "changed"
};

/*
 * TagStore
 */
var TagStore = assign({}, EventEmitter.prototype, {

    // --- Eventing {{{

    emitChange: function () {
        this.emit(TagStoreEvents.Changed);
    },

    addChangeListener: function (callback) {
        this.on(TagStoreEvents.Changed, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(TagStoreEvents.Changed, callback);
    },

    // --- }}}

    _tags: null,

    getAllTags: function () {
        return TagStore._tags;
    },

    nameForID: function (id) {
        if (TagStore._tags === null) {
            return "";
        }

        for (var i = 0; i < TagStore._tags.length; i++) {
            var tag = TagStore._tags[i];
            if (tag.id == id) {
                return tag.name;
            }
        }

        return "";
    },

    _initialize: function () {
        RecordStore.addChangeListener(this._recordChange);
    },

    _recordChange: function () {
        TagStore._tags = RecordStore.getAll("tag");
        TagStore.emitChange();
    },
});

/*
 * Register all event callbacks
 */
TagStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
      case AppConstants.APP_INITIALIZED:
        AppDispatcher.waitFor([RecordStore.dispatchToken]);
        TagStore._initialize();
        break;
      case AppConstants.TAG_REFRESH:
        break;
  }
});

module.exports = TagStore;

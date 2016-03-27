/*
 * Node's EventEmitter + object-assign
 */
var EventEmitter = require("events").EventEmitter;

/*
 * Require our own modules
 */
var AppDispatcher = require("../dispatcher/app-dispatcher");
var AppConstants = require("../constants/app-constants");

var Logger = require("../utils/logger");

var ConfigStore = require("../stores/config-store");

var Gaia = require("../core/gaia");

/*
 * "Private" variables and functions can go here
 */

var CLIStoreEvents = {
  Change: "change"
};

/*
 * CLIStore
 *  - Manages the elos cli
 */
var CLIStore = Object.assign({}, EventEmitter.prototype, {
  ws: null,
  _history: [],

  pushHistory: function(string) {
    this._history.push(string);
    this.emitChange();
  },

  init: function() {
    ConfigStore.addChangeListener(this._configChange);
    this._configChange();
  },

  _configChange: function() {
    CLIStore._attemptConnection(ConfigStore.getPublicCredential(), ConfigStore.getPrivateCredential());
  },

  _onMessage: function(event) {
    CLIStore.pushHistory(event.data);
  },

  _onClose: function() {
    this.ws = null;
  },

  _onOpen: function() {
    Logger.info("Websocket opened");
    CLIStore.pushHistory("Welcome to elos");
  },

  _attemptConnection: function() {
    if (this.ws !== null) {
      return;
    }

    this.ws = Gaia.ws(Gaia.endpoint("/command/web/"));
    if (!this.ws) {
      return;
    }
    this.ws.onmessage = this._onMessage;
    this.ws.onopen = this._onOpen;
    this.ws.onclose = this._onClose;
  },


  // --- Eventing {{{
  emitChange: function() {
    this.emit(CLIStoreEvents.Change);
  },

  addChangeListener: function(callback) {
    this.on(CLIStoreEvents.Change, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CLIStoreEvents.Change, callback);
  },
  // --- }}}


  sendInput: function(input) {
    if (this.ws !== null) {
      this.ws.send(input);
    }

    this.pushHistory("› " + input);
  },

  getHistory: function() {
    return this._history;
  }
});

/*
 * Register all event callbacks
 */
AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.CLI_INPUT:
      CLIStore.sendInput(action.data.input);
      break;
  }
});

CLIStore.init();

module.exports = CLIStore;

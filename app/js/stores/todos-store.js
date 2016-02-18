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
var RecordStore = require("../stores/record-store");
var RecordActionCreators = require("../action-creators/record-action-creators");
var Logger = require("../utils/logger");

/*
 * Private variables and functions can go here
 */
var TodosStoreEvents = {
    Changed: "changed"
};

/*
 * TodosStore
 */
var TodosStore = assign({}, EventEmitter.prototype, {
    todos: [],

    getTodos: function() {
        return this.todos;
    },

    initialize: function () {
        Logger.info("initialize");
        RecordStore.addChangeListener(this._recordChange);
        this.refresh();
    },

    refresh: function () {
        RecordActionCreators.query("task", {});
    },

    _recordChange: function () {
        Logger.info("record changed in TodossTore");
        TodosStore.todos = RecordStore.getAll("task");
        Logger.info(TodosStore.todos);
        TodosStore.emitChange();
    },

    emitChange: function () {
        this.emit(TodosStoreEvents.Changed);
    },

    addChangeListener: function (callback) {
        this.on(TodosStoreEvents.Changed, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(TodosStoreEvents.Changed, callback);
    },

    _completeTask: function(id) {
        Logger.info(id);
        var existing = RecordStore.records.task[id];
        existing.completed_at = new Date();
        RecordStore._save("task", existing);
    }
});

/*
 * Register all event callbacks
 */
AppDispatcher.register(function (action) {
  switch (action.actionType) {
      case AppConstants.TODOS_COMPLETE:
        TodosStore._completeTask(action.data.task_id);
        break;
      default:
          /*
           * Do nothing
           */
      break;
  }
});

TodosStore.initialize();

module.exports = TodosStore;

/*
 * Node's EventEmitter + object-assign
 */
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var moment = require("moment");

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
var TodosStoreEvents = {
    Changed: "changed"
};

/*
 * TodosStore
 */
var TodosStore = assign({}, EventEmitter.prototype, {

    // --- Eventing {{{

    emitChange: function () {
        this.emit(TodosStoreEvents.Changed);
    },

    addChangeListener: function (callback) {
        this.on(TodosStoreEvents.Changed, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(TodosStoreEvents.Changed, callback);
    },

    // --- }}}

    _initialize: function () {
        RecordStore.addChangeListener(this._recordChange);
    },

    _recordChange: function () {
        var todos = RecordStore.getAll("task").map(TodosStore._processTodo);
        todos.sort(TodosStore.byImportance);
        TodosStore._todos = todos;
        TodosStore.emitChange();
    },

    // is in progress, then by deadline;
    _byImportance: function (a, b) {
        var ad = new Date(a.deadline);
        var bd = new Date(b.deadline);

        if (a.in_progress) {
            if (b.in_progress) {
                if (ad.getTime() === -62135596800000) {
                    return 1;
                }

                return ad.getTime() - bd.getTime();
            }

            return -1;
        }

        if (b.in_progress) {
            return 1;
        }

        if (ad.getTime() === -62135596800000) {
            return 1;
        }

        return ad.getTime() - bd.getTime();
    },

    // add in_progress, deadline_formatted, and time_spend attributes
    _processTodo: function (todo) {
        todo.stages = todo.stages || [];

        todo.in_progress = todo.stages.length % 2 === 1;

        var deadline = new Date(todo.deadline);
        todo.deadline_formatted = (deadline.getTime() === -62135596800000) ? "None" : deadline.toLocaleString();

        var stages = todo.stages.map(function (stage) {
            return new Date(stage);
        });

        if (stages.length % 2 === 1) {
            stages.push(new Date());
        }

        var i;

        var msSpent = 0;
        for (i = 0; i < stages.length;  i += 2) {
            msSpent += stages[i+1].getTime() - stages[i].getTime();
        }

        todo.time_spent = (msSpent === 0) ? "" : moment.duration(msSpent).humanize();

        return todo;
    },

    isCompleted: function (task) {
        var d = new Date(task.completed_at);
        return d.getTime() === -62135596800000; // not compelted
    },

    _refresh: function (handlers) {
        handlers = handlers || {};
        handlers.failure = handlers.failure || function (error) {
            if (error === DB.Error.Unauthorized) {
                SnackbarActionCreators.showMessage("Unauthorized", {
                    actionText: "LOGIN",
                    actionHandler: function () {
                        RouteActionCreators.ShowAccountDetails();
                    },
                });
            }
        };
        RecordActionCreators.query("task", {}, handlers);
    },

    _todos: [],

    getTodos: function() {
        return this._todos;
    },

    _completeTask: function(id) {
        var prior = RecordStore.get("task", id);

        if (!prior) {
            SnackbarActionCreators.showMessage("Couldn't find task");
            return;
        }

        var existing = JSON.parse(JSON.stringify(prior)),
            addedStage;

        existing.completed_at = new Date();

        if (existing.stages.length % 2 === 1) {
            existing.stages.push(new Date());
            addedStage = true;
        }

        RecordActionCreators.save("task", existing, {
            success: function () {
                SnackbarActionCreators.showMessage("Task completed", {
                    actionText: "UNDO",
                    actionHandler: function () {
                        RecordActionCreators.save("task", prior);
                    },
                });
            },
            failure: function (error) {
                SnackbarActionCreators.showMessage("Task couldn't be completed.. " + error, {
                        actionText: "RETRY",
                        actionHandler: TodosStore._completeTask.bind(TodosStore, id),
                });
            },
        });
    },

    _startTask: function (id) {
        var prior = RecordStore.get('task', id),
            existing = JSON.parse(JSON.stringify(prior));

        if (!prior) {
            SnackbarActionCreators.showMessage("Couldn't find task");
            return;
        }

        if (existing.stages.length % 2 !== 0) {
            SnackbarActionCreators.showMessage("Task already in progress");
            return;
        }

        existing.stages.push(new Date());
        RecordActionCreators.save("task", existing, {
            success: function () {
                SnackbarActionCreators.showMessage("Task started", {
                    actionText: "UNDO",
                    actionHandler: function () {
                        RecordActionCreators.save("task", prior);
                    },
                });
            },
            failure: function (error) {
                SnackbarActionCreators.showMessage("Task couldn't be started.. " + error, {
                        actionText: "RETRY",
                        actionHandler: TodosStore._completeTask.bind(TodosStore, id),
                });
            },
        });
    },

    _stopTask: function (id) {
        var prior = RecordStore.get('task', id),
            existing = JSON.parse(JSON.stringify(prior));

        if (!prior) {
            SnackbarActionCreators.showMessage("Couldn't find task");
            return;
        }

        if (existing.stages.length % 2 === 0) {
            SnackbarActionCreators.showMessage("Task not in progress");
            return;
        }

        existing.stages.push(new Date());
        RecordActionCreators.save("task", existing, {
            success: function () {
                SnackbarActionCreators.showMessage("Task stopped", {
                    actionText: "UNDO",
                    actionHandler: function () {
                        RecordActionCreators.save("task", prior);
                    },
                });
            },
            failure: function (error) {
                SnackbarActionCreators.showMessage("Task couldn't be stopped.. " + error, {
                        actionText: "RETRY",
                        actionHandler: TodosStore._completeTask.bind(TodosStore, id),
                });
            },
        });
    },

    _deleteTask: function(id) {
        var prior = RecordStore.get("task", id);

        if (!prior) {
            SnackbarActionCreators.showMessage("Couldn't find task");
            return;
        }

        RecordActionCreators.delete("task", prior, {
            success: function () {
                SnackbarActionCreators.showMessage("Task deleted", {
                    actionText: "UNDO",
                    actionHandler: function () {
                        RecordActionCreators.save("task", prior);
                    },
                });
            },
            failure: function (error) {
                SnackbarActionCreators.showMessage("Task couldn't be deleted.. " + error, {
                    actionText: "RETRY",
                    actionHandler: TodosStore._deleteTask.bind(TodosStore, id),
                });
            },
        });
    },
});

/*
 * Register all event callbacks
 */
AppDispatcher.register(function (action) {
  switch (action.actionType) {
      case AppConstants.APP_INITIALIZED:
        AppDispatcher.waitFor([RecordStore.dispatchToken]);
        TodosStore._initialize();
        break;
      case AppConstants.ROUTE_CHANGE:
        if (action.data.route === Routes.Todos) {
            TodosStore._refresh();
        }
        break;
      case AppConstants.TODOS_REFRESH:
        TodosStore._refresh();
        break;
      case AppConstants.TODOS_COMPLETE:
        TodosStore._completeTask(action.data.task_id);
        break;
      case AppConstants.TODOS_START:
        TodosStore._startTask(action.data.task_id);
        break;
      case AppConstants.TODOS_STOP:
        TodosStore._stopTask(action.data.task_id);
        break;
      case AppConstants.TODOS_DELETE:
        TodosStore._deleteTask(action.data.task_id);
        break;
      default:
          /*
           * Do nothing
           */
      break;
  }
});

module.exports = TodosStore;

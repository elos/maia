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
var RouteConstants = require("../constants/route-constants");

/*
 * "Private" variables and functions can go here
 */
var RouteStoreEvents = {
    Changed: "changed"
};

/*
 * RouteStore: stores and manages the current route, stores and retrieves it
 * from the URL as well
 */
var RouteStore = assign({}, EventEmitter.prototype, {
    // Landing is the route to which uses visiting '/' are redirected
    // to. This is a sort of configuration.
    Landing: RouteConstants.CLI,

    // --- Eventing {{{

    emitChange: function () {
        this.emit(RouteStoreEvents.Changed);
    },

    addChangeListener: function (callback) {
        this.on(RouteStoreEvents.Changed, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(RouteStoreEvents.Changed, callback);
    },

    // --- }}}

    // --- Public Accessors (getCurrentRoute) {{{

    // Current route as managed by the RouteStore
    getCurrentRoute: function() {
        return this._route;
    },

    // --- }}}

    // --- Private (_route, _initialize(), _changeRouteTo) {{{

    // internal recollection of state
    _route: RouteConstants.CLI,

    // initialization
    _initialize: function () {
        // Get the current route, the hash : '#!/foo/bar'
        // is used for web apps to put state in the URL
        var hash = window.location.hash;

        // if it's empty or base, redirect to our landing
        if (hash.length === 0 || hash.length === "#!/") {
            this._changeRouteTo(this.Landing);
            return;
        }

        // otherwise we want to transition to the screen
        // represented by the route given there.
        this._changeRouteTo(hash.substring(3, hash.length));
    },

    _changeRouteTo: function(r) {
        window.history.pushState(
            "",  // state??
            r,   // title??
            // the actual url:
            window.location.origin + window.location.pathname + "#!/" + r
        );

        this._route = r;
        this.emitChange();
    }

    // --- }}}
});

/*
 * Register all event callbacks
 */
RouteStore.dispatchToken = AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case AppConstants.APP_INITIALIZED:
            RouteStore._initialize();
            break;
        case AppConstants.ROUTE_CHANGE:
            RouteStore._changeRouteTo(action.data.newRoute);
            break;
    }
});


module.exports = RouteStore;

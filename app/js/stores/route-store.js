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
        if (this._route.indexOf("?") === -1) {
            return this._route;
        }

        return this._route.substr(0, this._route.indexOf("?"));
    },

    getState: function (key) {
        var s = this._getState();

        if (s[key] === undefined) {
            return null;
        }

        return s[key];
    },

    // --- }}}

    // --- Private (_route, _initialize(), _changeRouteTo) {{{

    // internal recollection of state
    _route: RouteConstants.CLI,

    // initialization
    _initialize: function () {
        // Get the current route, the hash : '#!/foo/bar'
        // is used for web apps to put state in the URL
        // it eliminates the query parameter (which is state);
        var hash = window.location.hash;
        var route = hash;
        if (hash.indexOf("?") >= 0) {
            route = hash.substr(0, hash.indexOf("?"));
        }

        // if it's empty or base, redirect to our landing
        if (route.length === 0 || route.length === "#!/") {
            this._changeRouteTo(this.Landing);
            return;
        }

        var s = this._getState();

        // otherwise we want to transition to the screen
        // represented by the route given there.
        this._changeRouteTo(route.substring(3, route.length));
        this._putState(s);
    },

    _addState: function (key, value) {
        console.log("ADD SATE");
        var s = this._getState();
        s[key] = value;
        this._putState(s);
    },

    _changeRouteTo: function(r) {
        // need to maintain state
        /* don't preserver query
        var hash = window.location.hash;
        var query = "";
        if (hash.indexOf("?") >= 0) {
            query = hash.substr(hash.indexOf("?"));
        }
        */

        window.history.pushState(
            {},  // state??
            r,   // title??
            // the actual url:
            window.location.origin + window.location.pathname + "#!/" + r
        );

        this._route = r;
        this.emitChange();
    },

    _getState: function () {
        var hash = window.location.hash;

        if (hash.indexOf("?") === -1) {
            return {};
        }

        // then remove the ?
        var query = hash.substr(hash.indexOf("?")).substr(1);

        var parts = query.split("&");

        var state = {};

        for (var i = 0; i < parts.length; i++) {
            var item = parts[i].split("=");
            state[item[0]] = decodeURIComponent(item[1]);
        }

        return state;
    },

    _putState: function (s) {
        var url = window.location.toString();

        if (url.indexOf("?") === -1) {
            url += "?"
        } else {
            url = url.substr(0, url.indexOf("?")) + "?";
        }

        var needsUpdate = false;

        for (key in s) {
            if (s.hasOwnProperty(key)) {
                var val = s[key];
                if (val === null || val === undefined) {
                    continue;
                }

                needsUpdate = true;
                url = url + key + "=" + encodeURIComponent(s[key]) + "&";
            }
        }

        if (!needsUpdate) {
            return;
        }

        window.history.replaceState(
            s,
            "",
            url
        );

        this.emitChange();
    },

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
        case AppConstants.ROUTE_STATE_ADD:
            RouteStore._addState(action.data.key, action.data.value);
            break;
        case AppConstants.ROUTE_CHANGE:
            RouteStore._changeRouteTo(action.data.newRoute);
            break;
    }
});


module.exports = RouteStore;

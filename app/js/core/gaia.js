// Require our own modules
var Logger = require("../utils/logger");
var Base64 = require("../utils/base64");
var ConfigStore = require("../stores/config-store");

/*
 * Gaia is an interface for communicating with an instance of an Elos Gaia server.
 * Specifically, it applies all applicable headers, contains information about endpoint
 * and route construction, and any Gaia-specific error communication or configuration
 *
 * At present this consists mostly of the logic for creating HTTP requests to a gaia host.
 *
 * For more information regarding interacting with the elos ontology, see the DB module,
 * also included in the elos/core module set.
 */
var Gaia = {

    // --- URL Management (Host, Routes, endpoint(), wsEndpoint) {{{

    // Host is the URL representing the base of a gaia endpoint.
    // To construct particular URL's for a host, use the Gaia.endpoint
    // method along with a route defined in the Gaia.Routes object
    // Note: A host includes the protocol, but omits a trailing slash,
    // as all Gaia.Routes contain a leading a trailing slash themselves
    Host: "http://elos.pw",

    // Routes holds the routes for known gaia endpoints.
    // Note: All Routes should start and end with a '/'
    Routes: {
        // Record is the primary endpoint for manipulating the elos ontology.
        Record: "/record/",

        // RecordQuery is the primary endpoint for querying the elos ontology.
        RecordQuery: "/record/query/",

        // RecordChanges is the primary endpoint for streaming record changes
        // Note: it is a websocket endpoint.
        RecordChanges: "/record/changes/",
    },

    // endpoint takes a gaia Route, such as one from Gaia.Routes.*,
    // and joins it with the current gaia endpoint to construct
    // a fully qualified url.
    endpoint: function (route) {
        return Gaia.Host + route;
    },

    // wsEndpoint uses endpoint to construct the route, but then replaces
    // the 'http' protocol with 'ws'
    wsEndpoint: function (route) {
        return this.endpoint(route).replace("http", "ws");
    },

    // --- }}}

    // --- Request Making (post, delete, get) {{{
    // Examples:
    //
    // Gaia.post(
    //      Gaia.endpoint(Gaia.Routes.Record),
    //      { "kind": "task" },
    //      { ... task object ... },
    //      function (status, responseText) {
    //          if (status !== 500) {
    //              // handle error
    //          } else {
    //              // resolve the callback with something
    //              // like JSON.parse(responseText)
    //          }
    //      }
    //  );

    // post creates a new POST to the supplied `url`,
    // with the supplied `params`, and `data`.
    // Appropriate gaia authorization is applied. The
    // important component for callers callback, with
    // signature: func(status int, responseText string)
    post: function(url, params, data, callback) {
        Logger.debug("Gaia.post");

        var xhr = new XMLHttpRequest();

        xhr.open(
            "POST",                       // method
            Gaia._encode(url, params),    // url
            true                          // async
        );

        Gaia._addAuthentication(xhr);
        Gaia._onResponse(xhr, callback);

        xhr.send(JSON.stringify(data));
    },

    // delete creates a new DELETE to the supplied `url`
    // with the supplied `params`.
    // Appropriate authroization is applied using the
    // ConfigStore. The important component for callers
    // callback, with signature:
    //   func(status int, responseText string)
    delete: function(url, params, callback) {
        Logger.debug("Gaia.delete");

        var xhr = new XMLHttpRequest();

        xhr.open(
            "DELETE",                   // method
            Gaia._encode(url, params),  // url
            true                        // async
        );

        Gaia._addAuthentication(xhr);
        Gaia._onResponse(xhr, callback);

        xhr.send();
    },

    // get creates a new GET to the supplied `url`
    // with the supplied `params`
    // Appropriate authorization is applied user the
    // ConfigStore. The important component for callers
    // is the callback, with signature:
    //   func(status int, responseText string)
    get: function(url, params, callback) {
        Logger.debug("RecordStore.get");

        var xhr = new XMLHttpRequest();

        xhr.open(
            "GET",                      // method
            Gaia._encode(url, params),  // url
            true                        // async
        );

        Gaia._addAuthentication(xhr);
        Gaia._onResponse(xhr, callback);

        xhr.send();
    },

    // --- }}}

    // --- Websockets (ws) {{{

    ws: function (endpoint) {
        return new WebSocket(
            this._encode(
                endpoint.replace("http", "ws"),
                {
                    "public": ConfigStore.getPublicCredential(),
                    "private": ConfigStore.getPrivateCredential(),
                }
            )
        );
    },

    // --- }}}

    // --- Private Methods (_encode, _addAuthentication, _onResponse) --- {{{

    // _encode takes a map of parameters and appends them to the url
    // i.e., _encode("example.com/", { 'foo': 'bar', 'car': 7 }
    //          => "example.com/?foo=bar&car=7&"
    _encode: function (url, params) {
        var param;

        url += "?";
        for (param in params) {
            if (params.hasOwnProperty(param)) {
                url = url + param + "=" + encodeURIComponent(params[param]) + "&";
            }
        }
        return url;
    },

    // _addAuthentication includes basic authentication using
    // the app's ConfigStore. This basic authentication is applied
    // as a base64 encoded Authorization Header
    _addAuthentication: function (xhr) {
        xhr.setRequestHeader(
            "Authorization",
            "Basic " + Base64.encode(
                ConfigStore.getPublicCredential() + ":" + ConfigStore.getPrivateCredential()
            )
        );
    },

    // _onResponse sets up 'callback' to be called with the
    // response status and responseText when the xhr resolves
    // Useful encapsulation of the xhr management, the callback
    // signature is: func(status int, responseText string)
    _onResponse: function (xhr, callback) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(xhr.status, xhr.responseText);
            }
        };
    },

    // --- }}}

};


module.exports = Gaia;

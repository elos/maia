// Require our own modules
var Logger = require("../utils/logger");
var Gaia = require("./gaia");

/*
 * DB is an interface for communicating with a Gaia-backed elos ontology. That
 * is to say that DB issues requests over the server in order to fulfill it's methods
 * but it encapsulates the necessary information to make these requests to Gaia.
 *
 * Use DB to manipulate the elos data ontology.
 */
var DB = {

    // --- Error Handling (Errors definitions, _errorFor private helper) {{{

    // Error represents the possible error objects a DB handler
    // can return.
    Error: {
        // Malformed corresponds to a HTTP status code of 400
        Malformed:     "malformed",

        // Unauthorized corresponds to a HTTP status code of 401
        Unauthorized:  "unauthorized",

        // NotFound corresponds to a HTTP status code of 404
        NotFound:      "not found",

        // Internal corresponds to a HTTP status code of 500
        // It is also currently the default error for an
        // unrecognized status code: i.e., a 4xx, 5xx series
        // not listed in this Errors object.
        Internal:      "internal server",
    },

    // _errorFor transforms a status to a DB.Errors string
    // use this when a request is determined to be unsuccesful
    // and you need to resolve a handler.error with a DB.Error
    _errorFor: function (status) {
        switch (status) {
            case 400:
                return DB.Error.Malformed;
            case 401:
                return DB.Error.Unauthorized;
            case 404:
                return DB.Error.NotFound;
            //case 500:
            default:
                return DB.Error.Internal;
        }
    },

    // --- }}}

    // --- Core Data Manipulation (find, save, delete, query)  {{{
    // All of these methods accept as their last parameter a handler,
    // this is the so-called DB Handler 'type'. A DB Handler is of the
    // form:
    //      {
    //          resolve: function (record(s)) {
    //              // do something with succesful return
    //          }
    //          error: function (error) {
    //              // do something with the DB.Error error
    //          }
    //      }
    //
    //  Examples:
    //
    //  DB.find("task", "123", {
    //      resolve: function (task) {
    //          // do something with the task object
    //      },
    //      error: function (error) {
    //          // handle the error
    //      }
    //  })

    // find asks Gaia for the record of kind `kind` and id `id`,
    // handler is a traditional DB handler.
    find: function (kind, id, handler) {
        Logger.debug("DB.find");

        Gaia.get(
            Gaia.endpoint(Gaia.Routes.Record),
            {
                id: id,
                kind: kind,
            },
            function (status, responseBody) {
                if (status !== 200) {
                    Logger.info("ERROR: " + status + " " + responseBody);
                    handler.error(DB._errorFor(status));
                    return;
                }

                handler.resolve(JSON.parse(responseBody));
            }
        );
    },

    // save persists the given record of kind `kind` to Gaia,
    // recall that if the record contains an id, that id is used,
    // (rejected if invalid) but if no id is contained the save
    // is treated as a creation. The handler is a traditional
    // DB handler.
    save: function (kind, record, handler) {
        Logger.debug("DB.save");

        Gaia.post(
            Gaia.endpoint(Gaia.Routes.Record),
            {
                kind: kind,
            },
            record,
            function (status, responseBody) {
                if (status === 200 || status === 201) {
                    handler.resolve(JSON.parse(responseBody));
                    return;
                }

                Logger.info("ERROR: " + status + " " + responseBody);

                handler.error(DB._errorFor(status));
                return;
            }
        );
    },

    // delete issues a delete for the (`kind`, `id`) pair to Gaia.
    // The handler is a traditional DB handler, but recall that
    // the responds is empty for a succesful delete.
    delete: function (kind, id, handler) {
        Logger.debug("DB.delete");
        Gaia.delete(
            Gaia.endpoint(Gaia.Routes.Record),
            {
                id: id,
                kind: kind,
            },
            function (status, responseBody) {
                if (status === 200) {
                    handler.resolve(JSON.parse(responseBody));
                    return;
                }

                Logger.info("ERROR: " + status + " " + responseBody);
                handler.error(DB._errorFor(status));
                return;
            }
        );
    },

    // query issues a query for a record of kind `kind` and attrs to match
    // against Gaia. Note that the handler is a traditional DB handler
    query: function (kind, attrs, handler) {
        Logger.debug("DB.query");

        attrs.kind = kind;

        Gaia.post(
            Gaia.endpoint(Gaia.Routes.RecordQuery),
            attrs,
            {},
            function (status, responseBody) {
                if (status !== 200) {
                    Logger.info("ERROR: " + status + " " + responseBody);
                    handler.error(DB._errorFor(status));
                    return;
                }

                handler.resolve(JSON.parse(responseBody));
            }
        );
    },

    // --- }}}

};

module.exports = DB;

/*
 * If there's no console (like in older IE versions when devtools isn't open)
 * create a stubbed console.
 */
if (!window.console) {
    window.console = {};
}

var noop = function () {
    /*
     * This function does nothing.
     */
};

/*
 * Stub out each function we will use if they don't exist
 */
if (!window.console.log) {
    window.console.log = noop;
}

var Logger = {
    DEBUG: false,

    info: function () {
        console.log.apply(console, arguments);
    },

    debug: function () {
        if (this.DEBUG) {
            console.log.apply(console, arguments);
        }
    },
};

module.exports = Logger;

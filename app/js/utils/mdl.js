// Imports
var Logger = require("./logger");

// --- Stubs {{{

// Assure a stubbed componentHandler exists
if (!window.componentHandler) {
    window.componentHandler = {}
}

// Assure a noop upgradeDom exists
if (!window.componentHandler.upgradeDom) {
    window.componentHandler.upgradeDom = function () {
        Logger.debug("[DEBUG][MDL]: no-op componentHandler.upgradeDom used");
    };
}

// --- }}}

// MDL provides an interface for "upgrading" material design light objects
// so they can be managed (animated, colored etc) by the MDL javascript
var MDL = {
    // refresh upgrades the entire DOM, anything with an mdl class declaration
    // gets upgraded
    refresh: function () {
        window.componentHandler.upgradeDom();
    },

    showSnack: function (divSelector, data) {
        var div = document.querySelector(divSelector);

        if (div) {
            div.MaterialSnackbar.showSnackbar(data);
            return;
        }

        if (!data.alreadyRetried) {
            data.alreadyRetried = true;
            // otherwise, queue up for later
            setTimeout(this.showSnack.bind(divSelector, data), 100);
        } else {
            Logger.info("MDL.showSnack failed to ever show: ", data);
        }
    },
};

module.exports = MDL;

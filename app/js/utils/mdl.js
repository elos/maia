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
    }
};

module.exports = MDL;

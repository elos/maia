var HomeActions = require ("../actions/home-actions");

var HomeActionCreators = {

    timerTick: function () {
        HomeActions.generateTick();
    },

};

module.exports = HomeActionCreators;

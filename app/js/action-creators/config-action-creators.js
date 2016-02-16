var ConfigActions = require ("../actions/config-actions");

var ConfigActionCreators = {

    update: function (publicC, privateC) {
        ConfigActions.update(publicC, privateC);
    },

};

module.exports = ConfigActionCreators;

var RouteActions = require ("../actions/route-actions");
var Routes = require("../constants/route-constants");

var RouteActionCreators = {

    ShowAccountDetails: function () {
        RouteActions.changeTo(Routes.AccountDetails);
    },

    ShowCLI: function () {
        RouteActions.changeTo(Routes.CLI);
    }

};

module.exports = RouteActionCreators;

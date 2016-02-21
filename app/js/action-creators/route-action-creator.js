var RouteActions = require ("../actions/route-actions");
var Routes = require("../constants/route-constants");

var RouteActionCreators = {

    ShowAccountDetails: function () {
        RouteActions.changeTo(Routes.AccountDetails);
    },

    ShowCLI: function () {
        RouteActions.changeTo(Routes.CLI);
    },

    ShowTodos: function () {
        RouteActions.changeTo(Routes.Todos);
    },

    ShowMap: function () {
        RouteActions.changeTo(Routes.Map);
    },
};

module.exports = RouteActionCreators;

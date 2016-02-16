var AppDispatcher = require("../dispatcher/app-dispatcher");
var AppConstants = require("../constants/app-constants");

var CLIActions = {

    input: function (input) {
        AppDispatcher.dispatch({
            actionType: AppConstants.CLI_INPUT,
            data: {
                input: input,
            }
        });
    }

};

module.exports = CLIActions;

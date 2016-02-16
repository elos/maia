var CLIActions = require ("../actions/cli-actions");

var CLIActionCreator = {

    input: function (input) {
        CLIActions.input(input);
    }

};

module.exports = CLIActionCreator;

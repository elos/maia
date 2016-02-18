/*
 * Require all third party libraries
 *
 * 1. `react` is required for `React.createClass`
 */
var React = require("react");

/*
 * Require any local code we need, like stores, utils etc.
 */
var Logger = require("../utils/logger");
var CLIStore = require("../stores/cli-store");
var CLIActionCreator = require("../action-creators/cli-action-creator");
var RouteActionCreator = require("../action-creators/route-action-creator");

/*
 * "Private" variables and functions can go here
 */

var CLI = React.createClass({

    /*
     * Called once when the component is mounted
     */
    componentDidMount: function () {
        CLIStore.addChangeListener(this._onNewChange);
    },

    /*
     * Called once when the component is unmounted
     */
    componentWillUnmount: function () {
        CLIStore.removeChangeListener(this._onNewChange);
    },

    /*
     * Called when the compoenent's changes are flushed to the DOM
     */
    //componentDidUpdate: function() { // This upgrades all upgradable components (i.e. with 'mdl-js-*' class) },

    /*
     * Called once before componentDidMount to set the initial component state.
     */
    getInitialState: function () {
        return {
            input: "",
            history: CLIStore.getHistory()
        };
    },

    changeInput: function (event) {
        this.setState({
            input: event.target.value,
        });
    },

    submitInput: function () {
        CLIActionCreator.input(this.state.input);
        this.setState({
            input: ""
        });
    },

    inputKeyPress: function (event) {
        if (event.key === 'Enter') {
            this.submitInput();
        }
    },

    /*
     * Called every time the state changes
     */
    render: function () {
        return (
            <div className="cli">
                <ul className="card">
                    {this.state.history.map(function(string, i) {
                        return <li key={i}> {string} </li>
                    })}
                </ul>
                <i className="material-icons">keyboard_arrow_right</i>
                <div className="mdl-textfield mdl-js-textfield">
                    <input className="mdl-textfield__input"
                        type="text"
                        id="publicCredential"
                        value={this.state.input}
                        onChange={this.changeInput}
                        onKeyPress={this.inputKeyPress} />
                    <label className="mdl-textfield__label" for="publicCredential">Input command...</label>
                </div>
           </div>
        );
    },

    /*
     * Private functions
     */
    _onNewChange: function () {
        this.setState({history: CLIStore.getHistory()});
    }
})

module.exports = CLI;

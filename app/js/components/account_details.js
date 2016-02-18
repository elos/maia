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
var ConfigStore = require("../stores/config-store");
var ConfigActionCreators = require("../action-creators/config-action-creator");
var RouteActionCreator = require("../action-creators/route-action-creator");

/*
 * "Private" variables and functions can go here
 */

var AccountDetails = React.createClass({

    /*
     * Called once when the component is mounted
     */
    componentDidMount: function () {
        componentHandler.upgradeDom(); // mdl
        Logger.info("account details mount");
    },

    /*
     * Called once when the component is unmounted
     */
    //componentWillUnmount: function () {},

    /*
     * Called when the compoenent's changes are flushed to the DOM
     */
    componentDidUpdate: function() {
        // This upgrades all upgradable components (i.e. with 'mdl-js-*' class)
        componentHandler.upgradeDom(); // mdl
    },

    /*
     * Called once before componentDidMount to set the initial component state.
     */
    getInitialState: function () {
        return {
            publicCredential: ConfigStore.getPublicCredential(),
            privateCredential: ConfigStore.getPrivateCredential()
        };
    },

    // Text update for the publicCredential field
    changePublicCredential: function (event) {
        this.setState({
            publicCredential: event.target.value
        });
    },

    // Text update for the privateCredential field
    changePrivateCredential: function (event) {
        this.setState({
            privateCredential: event.target.value
        });
    },

    // Persist these to the cookies store
    saveCredentials: function () {
        ConfigActionCreators.update(this.state.publicCredential,
                this.state.privateCredential);
    },

    /*
     * Called every time the state changes
     */
    render: function () {
        return (
            <div className="account-details mdl-card mdl-shadow--2dp">
                <div className="mdl-card__title">
                    <h2 className="mdl-card__title-text">Account Details</h2>
                </div>
                <form action="#">
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input className="mdl-textfield__input"
                            type="text"
                            id="publicCredential"
                            value={this.state.publicCredential}
                            onChange={this.changePublicCredential} />
                        <label className="mdl-textfield__label" for="publicCredential">Public Credential...</label>
                    </div>
                    <br />
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input className="mdl-textfield__input"
                            type="text" id="privateCredential"
                            value={this.state.privateCredential}
                            onChange={this.changePrivateCredential} />
                        <label className="mdl-textfield__label" for="privateCredenetial">Private Credential...</label>
                    </div>
                </form>
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"
                        onClick={this.saveCredentials}>
                  Save
                </button>
            </div>
        );
    },

    /*
     * Private functions
     */
})

module.exports = AccountDetails

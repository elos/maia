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
        Logger.info("account details mount");
    },

    /*
     * Called once when the component is unmounted
     */
    //componentWillUnmount: function () {},

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
            <div className="card">
                <p> Public Credential </p>
                <input type="text"
                       value={this.state.publicCredential}
                       onChange={this.changePublicCredential} />
                <p> Private Credential </p>
                <input type="password"
                       value={this.state.privateCredential}
                       onChange={this.changePrivateCredential} />
                <br/><br/>
                <input type="submit"
                       value="Save"
                       onClick={this.saveCredentials}/>
            </div>
        );
    },

    /*
     * Private functions
     */
})

module.exports = AccountDetails

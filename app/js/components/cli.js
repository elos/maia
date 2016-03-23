import React from "react";

/*
 * Require any local code we need, like stores, utils etc.
 */
var Logger = require("../utils/logger");
var CLIStore = require("../stores/cli-store");
var CLIActionCreator = require("../action-creators/cli-action-creator");
var RouteActionCreator = require("../action-creators/route-action-creator");

const CLI = React.createClass({

  // Called once when the component is mounted
  componentDidMount: function() {
    CLIStore.addChangeListener(this._onNewChange);
  },

  // Called once when the component is unmounted
  componentWillUnmount: function() {
    CLIStore.removeChangeListener(this._onNewChange);
  },

  // Called when the component's changes are flushed to the DOM
  componentDidUpdate: function() {
    var element = document.getElementById("cli-output-box");
    element.scrollTop = element.scrollHeight;
  },

  // Called once before componentDidMount to set the initial component state.
  getInitialState: function() {
    return {
      input: "",
      history: CLIStore.getHistory()
    };
  },

  changeInput: function(event) {
    this.setState({
      input: event.target.value,
    });
  },

  submitInput: function() {
    CLIActionCreator.input(this.state.input);
    this.setState({
      input: ""
    });
  },

  inputKeyPress: function(event) {
    if (event.key === 'Enter') {
      this.submitInput();
    }
  },

  /*
   * Called every time the state changes
   */
  render: function() {
    var text = "";
    var CLI = this;
    var i;
    for (i = this.state.history.length - 1; i >= 0; i--) {
      text = this.state.history[i] + text;
      if (i !== 0) {
        text = "\n" + text;
      }
    }

    return <div className="cli">
      <div className="todos-title">
        <h2 className="todos-title-text"> CLI </h2>
      </div>
      <div className="card">
        <div className="cli-output" id="cli-output-box"> {text} </div>
        <div className="cli-input">
          <i className="material-icons cli-input-icon">keyboard_arrow_right</i>
          <div className="mdl-textfield mdl-js-textfield cli-input-text-container">
          <input className="cli-input-text-field mdl-textfield__input" type="text"
      id="publicCredential"
      value={this.state.input}
      onChange={this.changeInput}
      onKeyPress={this.inputKeyPress} />
                        </div>
                    </div>
               </div>
            </div>;
  },

  /*
   * Private functions
   */
  _onNewChange: function() {
    this.setState({
      history: CLIStore.getHistory()
    });
  }
})

module.exports = CLI;

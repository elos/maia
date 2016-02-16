/*
 * Require all third party libraries
 *
 * 1. `react` is required for `React.createClass`
 */
var React = require("react");

/*
 * Require any local code we need, like stores, utils etc.
 */
var TickStore = require("../stores/tick-store");
var HomeActionCreators = require("../action-creators/home-action-creators");

/*
 * "Private" variables and functions can go here
 */
var _countDownTicker;

var Home = React.createClass({

    /*
     * Called once when the component is mounted
     */
    componentDidMount: function () {
        /*
         * Tell the TickStore we want to know about changes, and when
         * a change occurrs trigger our _onTickChange function.
         */
        TickStore.addChangeListener(this._onTickChange);

        /*
         * Start our own countdown that triggers ticks.
         */
        _countDownTicker = setInterval(this._onInterval, 1000);
    },

    /*
     * Called once when the component is unmounted
     */
    componentWillUnmount: function () {
        this._removeInterval();
    },

    /*
     * Called once before componentDidMount to set the initial component state.
     */
    getInitialState: function () {
        return {
            ticksRemaining: TickStore.getRemainingTicks()
        };
    },

    /*
     * Called every time the state changes
     */
    render: function () {
        var displayText = "All Done";

        if (this.state.ticksRemaining > 0) {
            displayText = this.state.ticksRemaining;
        }

        return (
            <div className="text-container">
                <span className="display-text">
                    {displayText}
                </span>
            </div>
        );
    },

    /*
     * Private functions
     */
    _onTickChange: function () {
        if (TickStore.hasMoreTicks()) {
            this.setState({
                ticksRemaining: TickStore.getRemainingTicks()
            });
        } else {
            this._removeInterval();
        }
    },

    _onInterval: function () {
        HomeActionCreators.timerTick();
    },

    _removeInterval: function () {
        if (_countDownTicker) {
            clearInterval(_countDownTicker);
            _countDownTicker = undefined;
        }
    }

});

module.exports = Home;

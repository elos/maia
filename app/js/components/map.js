/*
 * Require all third party libraries
 *
 * 1. `react` is required for `React.createClass`
 */
var React = require("react");
var GoogleMap = require('google-map-react');

/*
 * Require any local code we need, like stores, utils etc.
 */
var Logger = require("../utils/logger");
var RecordStore = require("../stores/record-store");
var RecordActionCreators = require("../action-creators/record-action-creators");

/*
 * "Private" variables and functions can go here
 */

var Map = React.createClass({
    /*
     * Called once when the component is mounted
     */
    componentDidMount: function () {
        RecordStore.addChangeListener(this._recordChange);
        RecordActionCreators.query("profile", {});
    },

    /*
     * Called once when the component is unmounted
     */
    componentWillUnmount: function () {
        RecordStore.removeChangeListener(this._recordChange);
    },

    /*
     * Called once before componentDidMount to set the initial component state.
     */
    getInitialState: function () {
        return {
            location: null,
        };
    },

    /*
     * Called every time the state changes
     */
    render: function () {
        var Map = this;
        var defaultCenter = this.state.location || {};
        var currentLocation = this.state.location;

        if (currentLocation) {
            return (
                <div style={{flexGrow: 1, height: document.querySelector("body").clientHeight-38, position: "absolute", width: "100vw"}}>
                    <GoogleMap
                        defaultCenter={{lat: 37.459741, lng: -122.172647}}
                        center={{lat: defaultCenter.latitude, lng: defaultCenter.longitude}}
                        defaultZoom={12}>
                        <div className="current-location" lat={currentLocation.latitude} lng={currentLocation.longitude}> </div>
                    </GoogleMap>
                </div>
            );
        } else {
            return (
                <div style={{margin: "200px auto"}} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
            );
        }
    },

    /*
     * Private functions
     */
    _recordChange: function () {
        var p = RecordStore.getAll("profile")[0];

        if (p === null) {
            return;
        }

        var l = RecordStore.get('location', p.location_id);

        if (l === null) {
            RecordActionCreators.find('location', p.location_id);
            return;
        }

        if (this.state.location === null) {
            this.setState({
                location: l,
            })
        }
    },
});

module.exports = Map;

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
var SnackbarActionCreators = require("../action-creators/snackbar-action-creators");
var RouteActionCreators = require("../action-creators/route-action-creator");

/*
 * "Private" variables and functions can go here
 */

var Map = React.createClass({
    /*
     * Called once when the component is mounted
     */
    componentDidMount: function () {
        RecordStore.addChangeListener(this._recordChange);

        RecordActionCreators.query("profile", {}, {
            failure: function (error) {
                SnackbarActionCreators.showMessage("Error loading profile: " + error);
            }
        });

        RecordActionCreators.query("location", {}, {
            failure: function (error ) {
                SnackbarActionCreators.showMessage("Error loading location information: " + error);
            }
        });
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
            locations: null,
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
        var locations = this.state.locations || [];
        locations = locations.slice(Math.max(locations.length - 100, 1));

        locations = locations.filter(function (l) {
            return l.latitude && l.longitude;
        });

        if (locations.length > 0) {
            SnackbarActionCreators.showMessage("Plotted last " + locations.length + " locations");
        }

        if (currentLocation) {
            return (
                <div style={{flexGrow: 1, height: document.querySelector("body").clientHeight-38, position: "absolute", width: "100vw"}} className="map-container">
                    <GoogleMap
                        defaultCenter={{lat: this.state.location.latitude, lng: this.state.location.longitude}}
                        defaultZoom={12}>
                        <div className="current-location" lat={currentLocation.latitude} lng={currentLocation.longitude}> </div>
                        {locations.map(function (l) {
                            return  ( <div key={l.id} id={l.id} style={{height: 4, width:4, borderRadius: 2, background: "red"}} lat={l.latitude} lng={l.longitude}></div> );
                            })
                        }
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

        if (this.state.location === null || this.state.location.id !== l.id) {
            this.setState({
                location: l,
            })
        }
    },
});

module.exports = Map;

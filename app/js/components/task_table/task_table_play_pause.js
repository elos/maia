var React = require("react");

var IconButton = require('material-ui/lib/icon-button');
var PlayCircle = require('material-ui/lib/svg-icons/av/play-circle-outline');
var PauseCircle = require('material-ui/lib/svg-icons/av/pause-circle-outline');

// props
// {
//  play fn()
//  pause fn()
//  on bool
// }
//
var TaskTablePlayPause = React.createClass({
  propTypes: {
    on: React.PropTypes.bool.isRequired,
    play: React.PropTypes.func.isRequired,
    pause: React.PropTypes.func.isRequired,
  },

  render: function() {
    var props = this.props;

    switch (props.on) {
      case true:
        return (
          <IconButton
          onTouchTap={function() {
            console.log("ASDFASDF"); props.pause();
          }}
          onClick={function() {
            console.log("HELLOW"); props.pause()
          }}>
                        <PauseCircle />
                    </IconButton>
          );
      case false:
      default:
        return (
          <IconButton onTouchTap={props.play}>
                        <PlayCircle />
                   </IconButton>
        )
    }
  }
});

module.exports = TaskTablePlayPause;

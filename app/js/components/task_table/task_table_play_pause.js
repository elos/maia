var React = require("react");

import IconButton from 'material-ui/lib/icon-button';
import PlayCircle from 'material-ui/lib/svg-icons/av/play-circle-outline';
import PauseCircle from 'material-ui/lib/svg-icons/av/pause-circle-outline';

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
        return <IconButton onClick={props.pause}> <PauseCircle /> </IconButton>;
      case false:
      default:
        return <IconButton onClick={props.play}> <PlayCircle /> </IconButton>;
    }
  },
});

export default TaskTablePlayPause;
module.exports = TaskTablePlayPause;

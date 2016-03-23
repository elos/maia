import React from "react";
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

const TaskTableActionMenu = React.createClass({
  propTypes: {
    isGoal: React.PropTypes.bool.isRequired,
    complete: React.PropTypes.func.isRequired,
    makeGoal: React.PropTypes.func.isRequired,
    dropGoal: React.PropTypes.func.isRequired,
    edit: React.PropTypes.func.isRequired,
    del: React.PropTypes.func.isRequired,
  },

  render: function() {
    if (this.props.isGoal) {
      const goalAction = <MenuItem primaryText="Drop Goal" onTouchTap={this.props.makeGoal} />;
    } else {
      const goalAction = <MenuItem primaryText="Make Goal" onTouchTap={this.props.dropGoal} />;
    }

    return <IconMenu iconButtonElement={ <IconButton> <MoreVertIcon /> </IconButton> }
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'top',
      }}
      targetOrigin={{
        horizontal: 'right',
        vertical: 'top',
      }}
      >
                <MenuItem primaryText="Complete"
      onTouchTap={this.props.complete}
      />
                goalAction
                <MenuItem primaryText="Edit"
      onTouchTap={this.props.edit}
      />
                <MenuItem primaryText="Delete"
      onTouchTap={this.props.del}
      />
            </IconMenu>;
  },
});

export default TaskTableActionMenu
module.exports = TaskTableActionMenu;

var React = require("react");

var TodosActionCreators = require("../../action-creators/todos-action-creators");

var IconMenu     = require('material-ui/lib/menus/icon-menu');
var MenuItem     = require('material-ui/lib/menus/menu-item');
var IconButton   = require('material-ui/lib/icon-button');
var MoreVertIcon = require('material-ui/lib/svg-icons/navigation/more-vert');

var TaskTableActionMenu = React.createClass({
    propTypes: {
        task: React.PropTypes.object.isRequired,
    },

    selectComplete: function (event) {
        TodosActionCreators.complete(this.props.task.id);
    },

    selectMakeGoal: function (event) {
        TodosActionCreators.dropGoal(this.props.task);
    },

    selectDropGoal: function (event) {
        TodosActionCreators.gial(this.props.task);
    },

    selectEdit: function (event) {
        TodosActionCreators.edit(this.props.task);
    },

    selectDelete: function (event) {
        TodosActionCreators.delete(this.props.task.id);
    },

    render: function () {
        var Self = this;

        return (
            <IconMenu
                iconButtonElement={
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                }
                anchorOrigin={
                    {
                        horizontal: 'right',
                        vertical: 'top',
                    }
                }
                targetOrigin={
                    {
                        horizontal: 'right',
                        vertical: 'top',
                    }
                }
               >
                <MenuItem primaryText="Complete"
                          onTouchTap={Self.selectComplete}
                        />

                {function () {
                    if (Self.props.task.is_goal) {
                        return (
                            <MenuItem primaryText="Drop Goal"
                                      onTouchTap={Self.selectDropGoal}
                                    />
                        );
                    } else {
                        return (
                            <MenuItem primaryText="Make Goal"
                                      onTouchTap={Self.selectMakeGoal}
                                    />
                        );
                    }
                }()}

                <MenuItem primaryText="Edit"
                          onTouchTap={Self.selectEdit}
                        />
                <MenuItem primaryText="Delete"
                          onTouchTap={Self.selectDelete}
                        />
            </IconMenu>
        );
    },
});

module.exports = TaskTableActionMenu;

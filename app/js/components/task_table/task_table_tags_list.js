import React from "react";
import Immutable from "immutable";

const TaskTableTagsList = React.createClass({
  propTypes: {
    tags: React.PropTypes.instanceOf(Immutable.List),
  },

  render: function() {
    const props = this.props;

    return <div style={{
        display: "flex",
        flexDirection: "row"
      }}>
          {props.tags.map(function(tag) {
        var name = tag.name;
        if (name && name !== "") {
          return <div key={tag.id} style={{
              borderRadius: 3,
              border: "1px solid #CCCCCC",
              padding: "0 5px",
              fontSize: 10,
              marginRight: 3
            }}>
                  {name}
                </div>;
        }
      })}
      </div>;
  }
});

export default TaskTableTagsList;
module.exports = TaskTableTagsList;

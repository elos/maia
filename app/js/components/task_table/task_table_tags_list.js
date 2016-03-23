import React from "react";
import Immutable from "immutable";

const Style = {
  TagContainer: {
    display: "flex",
    flexDirection: "row"
  },
  Tag: {
    borderRadius: 3,
    border: "1px solid #CCCCCC",
    padding: "0 5px",
    fontSize: 10,
    marginRight: 3
  },
};

const TaskTableTagsList = React.createClass({
  propTypes: {
    tags: React.PropTypes.instanceOf(Immutable.List),
  },

  render: function() {
    const props = this.props;

    const tags = props.tags.filter((t) => t.name && t.name !== "").map((tag) => {
      return <div key={tag.id} style={Style.Tag}> {tag.name} </div>;
    });

    return <div style={Style.TagContainer}> {tags} </div>;
  }
});

export default TaskTableTagsList;
module.exports = TaskTableTagsList;

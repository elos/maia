var Immutable = require("immutable");

var TaskState = Immutable.Record({
  loading: true,
});

export default TaskState;
module.exports = TaskState;

import Immutable from "immutable";

const CLIState = Immutable.Record({
  history: Immutable.List(),
  webSocket: null,
});

export default CLIState;
module.exports = CLIState;

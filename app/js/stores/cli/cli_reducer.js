// --- Imports {{{

// --- External
import Immutable from "immutable";

// --- Internal
import AppConstants from "../../constants/app-constants";
import CLIState from "./cli_state.js";

// --- }}}

function cli(state, action) {
  if (state === null || state === undefined) {
    state = new CLIState();
  }

  switch (action.type) {
    case AppConstants.CLI_INPUT:
      return state.set("history", state.get("history").push("› " + action.data.text));
    case AppConstants.CLI_OUTPUT:
      return state.set("history", state.get("history").push(action.data.text));
    case AppConstants.CLI_WS_OPEN:
      return state.set("webSocket", action.data.ws);
    case AppConstants.CLI_WS_CLOSE:
      if (state.get("webSocket") === action.data.ws) {
        return state.set("webSocket", null);
      } else {
        return state;
      }
    default:
      return state
  }
}

export default cli;
module.exports = cli;

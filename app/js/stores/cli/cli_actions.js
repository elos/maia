// --- Imports {{{

// --- External
import Immutable from "immutable";

// --- Internal
import AppConstants from "../../constants/app-constants";

// --- }}}

const CLITextData = Immutable.Record({
  text: "",
});

const CLIInputAction = Immutable.Record({
  type: AppConstants.CLI_INPUT,
  data: new CLITextData(),
});

const CLIOutputAction = Immutable.Record({
  type: AppConstants.CLI_OUTPUT,
  data: new CLITextData(),
});

const CLIWebSocketData = Immutable.Recor({
  ws: null,
});

const CLIWebSocketOpenAction = Immutable.Record({
  type: AppConstants.CLI_WS_OPEN,
  data: new CLIWebSocketData,
});

const CLIWebSocketCloseAction = Immutable.Record({
  type: AppConstants.CLI_WS_CLOSE,
  data: new CLIWebSocketData,
});

const core = {
  input: function(text /*string*/ ) {
    return new CLIInputAction({
      data: new CLITextData({
        text: text,
      })
    });
  },
  output: function(text /*string*/ ) {
    return new CLIOutputAction({
      data: new CLITextData({
        text: text,
      })
    });
  },
  open: function(ws /*WebSocket*/ ) {
    return new CLIWebSocketOpenAction({
      data: new CLIWebSocketData({
        ws: ws,
      }),
    });
  },
  close: function(ws /*WebSocket*/ ) {
    return new CLIWebSocketCloseAction({
      data: new CLIWebSocketData({
        ws: ws,
      }),
    });
  }
}

export default core;
module.exports = core;

jest.unmock("../app.js");
jest.unmock("../stores/record/record_reducer");
jest.unmock("../stores/task/task_reducer");
jest.unmock("../stores/cli/cli_reducer");


// sketch:
jest.unmock("../stores/cli-store");

import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";

import App from "../app.js";
import Gaia from "../core/gaia";
Gaia.ws.mockReturnValue({});

describe("App", () => {
  it("renders", () => {
    const app = TestUtils.renderIntoDocument(
      <App />
    );

    expect(app).toBeDefined();
    expect(app).not.toBe(null);
  });
});

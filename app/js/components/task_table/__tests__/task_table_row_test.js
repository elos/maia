jest.unmock("../task_table_row");
jest.unmock("../../../core/models")

// --- External
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import Immutable from "immutable";

// --- Internal
import { Task, Tag } from "../../../core/models";
import TaskTableRow from "../task_table_row";

// Mocked import
const TodosActionCreators = jest.genMockFromModule("../../../action-creators/todos-action-creators");

describe("TaskTableRow", () => {
  it("renders", () => {
    const task = (new Task()).set("in_progress", true).set("is_goal", false).set("tags", Immutable.List([new Tag({
      id: "1",
      name: "One"
    }), new Tag({
      id: "2",
      name: "Two"
    })]));

    const row = TestUtils.renderIntoDocument(
      <table>
      <tbody>
        <TaskTableRow task={task} actionCreator={TodosActionCreators} />
      </tbody>
      </table>
    );

    expect(row).toBeDefined();
    expect(row).not.toBe(null);
  });
})

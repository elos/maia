jest.unmock("../task_table_action_menu");

// --- External
import React from "react";
import ReactDOM from "react-dom"
import TestUtils from "react-addons-test-utils";

// --- Internal
import TaskTableActionMenu from "../task_table_action_menu";

describe("TaskTableActionMenu", () => {
  it("dispatches actions appropriately", () => {
    const complete = jest.fn();
    const makeG = jest.fn();
    const dropG = jest.fn();
    const del = jest.fn();
    const edit = jest.fn();

    const actions = TestUtils.renderIntoDocument(
      <TaskTableActionMenu isGoal={false} edit={edit} complete={complete} makeGoal={makeG} dropGoal={dropG} del={del} />
    );

    expect(actions).toBeDefined();
  });
});

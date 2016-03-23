jest.unmock("../task_table_row");
jest.unmock("../task_table_implementation");
jest.unmock("../../../core/models");

// --- External
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import Immutable from "immutable";

// Internal
import { Task, Tag } from "../../../core/models";
import TaskTableImplementation from "../task_table_implementation";
import TodosActionCreators from "../../../action-creators/todos-action-creators";

describe("TaskTableImplementation", () => {
  it("renders", () => {
    const tasks = Immutable.List([
      new Task({
        id: "1",
        name: "Task 1",
        in_progress: true,
        is_goal: false,
        tags: Immutable.List([new Tag({
          id: "1"
        })]),
      }),
      new Task({
        id: "2",
        name: "Task 2",
        in_progress: false,
        is_goal: true,
        tags: Immutable.List([
          new Tag({
            id: "3",
            name: "testing 123",
          }),
        ])
      })
    ]);

    const table = TestUtils.renderIntoDocument(
      <TaskTableImplementation tasks={tasks} isLoading={false} actionCreator={TodosActionCreators} />
    )

    expect(table).toBeDefined()
    expect(table).not.toBe(null);

    const tableNode = ReactDOM.findDOMNode(table);

    expect(tableNode).toBeDefined()
    expect(tableNode).not.toBe(null);

    // name of a task
    expect(tableNode.outerHTML).toContain("Task 1")
  });
});

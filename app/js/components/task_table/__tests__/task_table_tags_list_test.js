jest.unmock("../task_table_tags_list");
jest.unmock("../../../core/models");

// --- External
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import Immutable from "immutable";

// --- Internal
import TaskTableTagsList from "../task_table_tags_list";
import { Tag } from "../../../core/models";

describe("TaskTableTagsList", () => {
  it("renders a list of tags", () => {
    const tags = Immutable.List([new Tag({
      id: "1",
      name: "Tag 1"
    }), new Tag({
      id: "2",
      name: "Tag 2"
    })]);

    const tagsList = TestUtils.renderIntoDocument(
      <TaskTableTagsList tags={tags} />
    );

    expect(tagsList).not.toBe(null);
    expect(tagsList).toBeDefined();

    const tagsListNode = ReactDOM.findDOMNode(tagsList);
    const test = tagsListNode.outerHTML
    expect(test).toContain("Tag 1");
    expect(test).toContain("Tag 2");
  });
});

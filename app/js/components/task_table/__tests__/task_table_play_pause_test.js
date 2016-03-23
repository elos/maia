jest.unmock("../task_table_play_pause");

import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import TaskTablePlayPause from "../task_table_play_pause";

describe('TaskTablePlayPause', function() {
  it('pauses when on', () => {
    const play = jest.fn();
    const pause = jest.fn();
    const playPause = TestUtils.renderIntoDocument(
      <TaskTablePlayPause on={true} play={play} pause={pause} />
    );

    expect(playPause).not.toBe(null);

    const playPauseNode = ReactDOM.findDOMNode(playPause);

    expect(playPauseNode).not.toBe(null);
    expect(playPause).not.toBe(playPauseNode);

    TestUtils.Simulate.click(playPauseNode);
    TestUtils.Simulate.touchEnd(playPauseNode);

    expect(pause).toBeCalled();
    expect(play).not.toBeCalled();
  });

  it("plays when off", () => {
    const play = jest.fn();
    const pause = jest.fn();
    const playPause = TestUtils.renderIntoDocument(
      <TaskTablePlayPause on={false} play={play} pause={pause} />
    );

    expect(playPause).not.toBe(null);
    expect(playPause).not.toBe(undefined);

    const playPauseNode = ReactDOM.findDOMNode(playPause);
    expect(playPauseNode).not.toBe(null);
    expect(playPauseNode).not.toBe(undefined);
    expect(playPauseNode).not.toBe(playPause);

    TestUtils.Simulate.click(playPauseNode);
    expect(play).toBeCalled();
    expect(pause).not.toBeCalled();
  })
});

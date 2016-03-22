jest.dontMock("../task_table_play_pause");

describe('TaskTablePlayPause', function() {
  var React = require("react");
  var ReactDOM = require("react-dom");
  var TestUtils = require("react-addons-test-utils");
  var TaskTablePlayPause = require("../task_table_play_pause");

  it('renders correctly', function() {
    const play = jest.fn(function() {});
    const pause = jest.fn(function() {});
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
});

var React = require("react");

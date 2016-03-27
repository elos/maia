// --- External
import React from "react";
import { Provider } from "react-redux";
import { createStore, combineReducers } from 'redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

// Components
import CLI from "./components/cli.js";

// Reducers
import record_reducer from './stores/record/record_reducer';
import task_reducer from './stores/task/task_reducer';
import cli_reducer from './stores/cli/cli_reducer';

const appReducer = combineReducers({
  record: record_reducer,
  task: task_reducer,
  cli: cli_reducer,

  routing: routerReducer,
});

const store = createStore(appReducer);

const history = syncHistoryWithStore(browserHistory, store)

const Frame = React.createClass({
  render: function() {
    return <div>
      Frame
      {this.props.children}
    </div>;
  }
});

const App = React.createClass({
  render: function() {
    return <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={Frame}>
          <IndexRoute component={CLI}/>
        </Route>
      </Router>
    </Provider>
  },
});

export default App;
module.exports = App;

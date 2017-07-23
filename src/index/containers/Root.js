import React from 'react';
import Route from 'react-router/Route';
import Router from 'react-router/Router';
import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import Provider from 'react-redux/es/components/Provider';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';

import App from './App';

import reducers from '../reducers';

const history = createBrowserHistory();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line

const store = createStore(combineReducers({
  ...reducers,
  routing: routerReducer,
}), composeEnhancers(applyMiddleware(routerMiddleware(history), thunk)));

const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} />
    </Router>
  </Provider>
);

// export default withRouter(connect(null)(Root));
export default Root;

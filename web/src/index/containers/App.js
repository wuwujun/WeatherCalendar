import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router/Route';
import withRouter from 'react-router/withRouter';
import connect from 'react-redux/es/connect/connect';

import Weather from './Weather';
import Schedule from './Schedule';
import City from './City';
import Task from './Task';

import { fetchCityList, loadSelectedCity } from '../actions/city';
import { fetchNow, fetchFuture, fetchSuggestion } from '../actions/weather';
import { loadTasks } from '../actions/schedule';

class App extends React.Component {
  componentDidMount() {
    this.props.fetchCityList((err, raw) => {
      if (err) {
        // TODO
        return;
      }
      this.props.loadSelectedCity((adcode) => {
        const coord = raw[adcode].coord;
        this.fetchData(coord);
      });
    });
    this.props.loadTasks();
  }

  fetchData(coord, push = false) {
    this.props.fetchNow(coord);
    this.props.fetchFuture(coord);
    this.props.fetchSuggestion(coord);
    if (push) {
      this.props.history.push('/index.html');
    }
  }

  render() {
    return (
      <div>
        <Route path="/index.html" component={Weather} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/city" render={() => <City onSelectCity={coord => this.fetchData(coord, true)} />} />
        <Route path="/task/:time/:edittime" component={Task} />
      </div>
    );
  }
}

App.propTypes = {
  history: PropTypes.object,
  fetchNow: PropTypes.func,
  fetchFuture: PropTypes.func,
  fetchSuggestion: PropTypes.func,
  fetchCityList: PropTypes.func,
  loadSelectedCity: PropTypes.func,
  loadTasks: PropTypes.func,
};

export default withRouter(connect(null, {
  fetchNow,
  fetchFuture,
  fetchSuggestion,
  fetchCityList,
  loadSelectedCity,
  loadTasks,
})(App));

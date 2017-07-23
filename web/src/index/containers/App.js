import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router/Route';
import withRouter from 'react-router/withRouter';
import connect from 'react-redux/es/connect/connect';
import NavLink from '../components/NavLink';

import Weather from './Weather';
import Schedule from './Schedule';
import City from './City';

import { fetchCityList, loadSelectedCity } from '../actions/city';
import { fetchNow, fetchFuture, fetchSuggestion } from '../actions/weather';

class App extends React.Component {
  componentDidMount() {
    this.props.fetchCityList((err, raw) => {
      if (err) {
        // TODO
        return;
      }
      this.props.loadSelectedCity((adcode) => {
        const coord = raw[adcode].coord;
        this.props.fetchNow(coord);
        this.props.fetchFuture(coord);
        this.props.fetchSuggestion(coord);
      });
    });
  }

  render() {
    return (
      <div>
        <NavLink exact to="/" activeStyle={{ fontWeight: 'bolder' }}>Home</NavLink>
        <NavLink to="/schedule" activeStyle={{ fontWeight: 'bolder' }}>Schedule</NavLink>
        <NavLink to="/city" activeStyle={{ fontWeight: 'bolder' }}>City</NavLink>
        <Route exact path="/" component={Weather} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/city" component={City} />
      </div>
    );
  }
}

App.propTypes = {
  fetchNow: PropTypes.func,
  fetchFuture: PropTypes.func,
  fetchSuggestion: PropTypes.func,
  fetchCityList: PropTypes.func,
  loadSelectedCity: PropTypes.func,
};

export default withRouter(connect(null, {
  fetchNow,
  fetchFuture,
  fetchSuggestion,
  fetchCityList,
  loadSelectedCity,
})(App));

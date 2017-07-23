import R from 'ramda';
import {
  SET_NOW_DATA,
  SET_FUTURE_DATA,
  SET_LIFE_SUGGESTION,
} from '../actions/weather';

const initialState = {
  now: {},
  future: [],
  suggestion: {},
};

const setFunc = tag => (state, data) => R.evolve({
  [tag]: R.always(data),
})(state);

const handlers = {
  [SET_NOW_DATA]: setFunc('now'),
  [SET_FUTURE_DATA]: setFunc('future'),
  [SET_LIFE_SUGGESTION]: setFunc('suggestion'),
};

export default (state = initialState, action) =>
  R.propOr(R.identity, action.type, handlers)(state, action.payload);

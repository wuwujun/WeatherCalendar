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

const handlers = {
  [SET_NOW_DATA]: R.assoc('now'),
  [SET_FUTURE_DATA]: R.assoc('future'),
  [SET_LIFE_SUGGESTION]: R.assoc('suggestion'),
};

export default (state = initialState, action) =>
  R.propOr(R.always(R.identity), action.type, handlers)(action.payload)(state);

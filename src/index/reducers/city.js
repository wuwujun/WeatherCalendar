import R from 'ramda';
import {
  SET_LIST,
  SELECT_CITY,
  TOGGLE_ACCORDION,
} from '../actions/city';

const initialState = {
  raw: {},
  list: {},
  selected: '110000',
};

const handlers = {
  [SET_LIST]: (state, data) => R.evolve({
    raw: R.always(data.raw),
    list: R.always(data.list),
  })(state),
  [SELECT_CITY]: (state, data) => R.evolve({
    selected: R.always(data),
  })(state),
  [TOGGLE_ACCORDION]: (state, data) => R.evolve({
    raw: {
      [data.adcode]: R.not,
    },
  })(state),
};

export default (state = initialState, action) =>
  R.propOr(R.identity, action.type, handlers)(state, action.payload);

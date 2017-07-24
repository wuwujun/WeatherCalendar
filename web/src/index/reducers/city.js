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
  [SET_LIST]: ({ raw, list }) => R.evolve({
    raw: R.always(raw),
    list: R.always(list),
  }),
  [SELECT_CITY]: R.assoc('selected'),
  [TOGGLE_ACCORDION]: data => R.evolve({
    raw: {
      [data]: {
        unfold: R.not,
      },
    },
  }),
};

export default (state = initialState, action) =>
  R.propOr(R.always(R.identity), action.type, handlers)(action.payload)(state);

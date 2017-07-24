import R from 'ramda';

import {
  LOAD_TASKS,
  SET_TODAY,
  EDIT_TASK,
  RESET_EDIT,
  SET_TASK,
  DEL_TASK,
} from '../actions/schedule';

const defaultTask = {
  hour: 0,
  minute: 0,
  text: '',
};

const initialState = {
  task: { 0: defaultTask },
  today: Date.now(),
};

const handlers = {
  [LOAD_TASKS]: data => R.assoc('task', R.assoc('0', R.clone(defaultTask), data)),
  [SET_TODAY]: R.assoc('today'),
  [EDIT_TASK]: ({ path, data }) => R.assocPath(path, data),
  [RESET_EDIT]: () => R.evolve({
    task: {
      0: R.always(R.clone(defaultTask)),
    },
  }),
  [SET_TASK]: ({ time, data }) => R.pipe(
    R.ifElse(R.path(['task', time.toString(10)]), R.dissocPath(['task', time.toString(10)]), R.identity),
    R.assocPath(['task', data.time.toString(10)], data),
    R.assocPath(['task', '0'], R.clone(defaultTask))
  ),
  [DEL_TASK]: time => R.ifElse(R.path(['task', time.toString(10)]), R.dissocPath(['task', time.toString(10)]), R.identity),
};

export default (state = initialState, action) =>
  R.propOr(R.always(R.identity), action.type, handlers)(action.payload)(state);

import cache from '../utils/cache';

const TASKS_DATA = '_SCHEDULE_TASKS_DATA';

export const LOAD_TASKS = '_SCHEDULE_LOAD_TASKS';
export const storeData = () => (_, getState) => {
  const { schedule: { task } } = getState();

  cache.store(TASKS_DATA, task, 1e5);
};
export const loadTasks = () => (dispatch) => {
  const data = cache.load(TASKS_DATA) || {};
  dispatch({
    type: LOAD_TASKS,
    payload: data,
  });
};

export const SET_TODAY = '_SCHEDULE_SET_TODAY';
export const setToday = time => ({
  type: SET_TODAY,
  payload: time,
});

export const EDIT_TASK = '_SCHEDULE_EDIT_TASK';
export const editTask = (path, data) => ({
  type: EDIT_TASK,
  payload: { path, data },
});

export const RESET_EDIT = '_SCHEDULE_RESET_EDIT';
export const resetEdit = () => ({
  type: RESET_EDIT,
});

export const SET_TASK = '_SCHEDULE_SET_TASK';
export const setTask = (time, data) => (dispatch) => {
  dispatch({
    type: SET_TASK,
    payload: { time, data },
  });
  dispatch(storeData());
};

export const DEL_TASK = '_SCHEDULE_DEL_TASK';
export const delTask = time => (dispatch) => {
  dispatch({
    type: DEL_TASK,
    payload: time,
  });
  dispatch(storeData());
};


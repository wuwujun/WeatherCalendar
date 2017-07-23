import superagent from 'superagent/superagent';

import cache from '../utils/cache';

const NOW_DATA = '_XINZHI_WEATHER_NOW_DATA';
const FUTURE_DATA = '_XINZHI_WEATHER_FUTURE_DATA';
const LIFE_SUGGESTION = '_XINZHI_WEATHER_LIFE_SUGGESTION';

const noop = () => {};

const checkError = (data) => {
  if (!data.results || !data.results[0]) {
    return new Error(`[${data.status_code}]: ${data.status}`);
  }
  return false;
};

export const SET_NOW_DATA = '_WEATHER_SET_NOW_DATA';
export const fetchNow = (location, cb = noop) => (dispatch) => {
  const cachedata = cache.load(NOW_DATA + location);
  if (cachedata) {
    dispatch({
      type: SET_NOW_DATA,
      payload: cachedata,
    });
    cb(cachedata);
    return;
  }

  superagent.get('/api/xinzhi/-/weather/now.json')
  .query({ location })
  .end((err, res) => {
    if (err) cb(err);
    else {
      const data = res.body;
      const ex = checkError(data);
      if (!ex) {
        const now = data.results[0].now;
        cache.store(NOW_DATA + location, now, 2);
        dispatch({
          type: SET_NOW_DATA,
          payload: now,
        });
        cb(null, now);
      } else {
        cb(ex);
      }
    }
  });
};

export const SET_FUTURE_DATA = '_WEATHER_SET_FUTURE_DATA';
export const fetchFuture = (location, cb = noop) => (dispatch) => {
  const cachedata = cache.load(FUTURE_DATA + location);
  if (cachedata) {
    dispatch({
      type: SET_FUTURE_DATA,
      payload: cachedata,
    });
    cb(null, cachedata);
    return;
  }

  superagent.get('/api/xinzhi/-/weather/daily.json')
  .query({ location })
  .end((err, res) => {
    if (err) cb(err);
    else {
      const data = res.body;
      const ex = checkError(data);
      if (!ex) {
        const daily = data.results[0].daily;
        cache.store(FUTURE_DATA + location, daily, 2);
        dispatch({
          type: SET_FUTURE_DATA,
          payload: daily,
        });
        cb(null, daily);
      } else {
        cb(ex);
      }
    }
  });
};

export const SET_LIFE_SUGGESTION = '_WEATHER_SET_LIFE_SUGGESTION';
export const fetchSuggestion = (location, cb = noop) => (dispatch) => {
  const cachedata = cache.load(LIFE_SUGGESTION + location);
  if (cachedata) {
    dispatch({
      type: SET_LIFE_SUGGESTION,
      payload: cachedata,
    });
    cb(null, cachedata);
    return;
  }

  superagent.get('/api/xinzhi/-/life/suggestion.json')
  .query({ location })
  .end((err, res) => {
    if (err) cb(err);
    else {
      const data = res.body;
      const ex = checkError(data);
      if (!ex) {
        const suggestion = data.results[0].suggestion;
        cache.store(LIFE_SUGGESTION + location, suggestion, 2);
        dispatch({
          type: SET_LIFE_SUGGESTION,
          payload: suggestion,
        });
        cb(null, suggestion);
      } else {
        cb(ex);
      }
    }
  });
};

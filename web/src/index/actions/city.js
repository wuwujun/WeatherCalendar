import R from 'ramda';

import amap from '../utils/amap';
import cache from '../utils/cache';

const SELECTED_CITY_ADCODE = 'SELECTED_CITY_ADCODE';
const DEFAULT_CITY_ADCODE = '110000';

export const SET_LIST = '_CITY_SET_LIST';
export const fetchCityList = cb => (dispatch) => {
  amap.loadCities()
  .then((data) => {
    const list = R.keys(R.filter(R.propEq('level', 'province'))(data));
    dispatch({
      type: SET_LIST,
      payload: { raw: data, list },
    });
    cb(null, data);
  })
  .catch((err) => {
    cb(err);
  });
};

export const TOGGLE_ACCORDION = '_CITY_TOGGLE_ACCORDION';
export const toggleAccordion = adcode => ({
  type: TOGGLE_ACCORDION,
  payload: adcode,
});

export const SELECT_CITY = '_CITY_SELECT';
export const selectCity = adcode => (dispatch) => {
  cache.store(SELECTED_CITY_ADCODE, adcode, 10000);
  dispatch({
    type: SELECT_CITY,
    payload: adcode,
  });
};

export const loadSelectedCity = cb => (dispatch, getState) => {
  const raw = R.path(['city', 'raw'])(getState());
  const adcode = cache.load(SELECTED_CITY_ADCODE) || DEFAULT_CITY_ADCODE;
  dispatch({
    type: SELECT_CITY,
    payload: adcode,
  });

  if (raw[adcode].parent) {
    dispatch({
      type: TOGGLE_ACCORDION,
      payload: raw[adcode].parent,
    });
  }

  cb(adcode);
};

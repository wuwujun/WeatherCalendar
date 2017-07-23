import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import R from 'ramda';
import cx from 'classnames';

import { selectCity, toggleAccordion } from '../actions/city';

import { spcodes } from '../utils/amap';

const mcs = [spcodes.北京, spcodes.天津, spcodes.上海, spcodes.重庆];

const City = (props) => {
  const { raw, list, selected } = props;

  return (
    <ul>
      {list.map((adcode) => {
        const ret = [];
        const prov = raw[adcode];
        const isMc = mcs.indexOf(adcode) !== -1;

        ret.push(
          <li
            key={adcode}
            className={cx('item-province', {
              municipality: isMc,
              active: adcode === selected,
            })}
          >
            <button
              onClick={() => {
                if (!isMc) {
                  props.toggleAccordion(adcode);
                } else if (selected !== adcode) {
                  props.selectCity(adcode);
                }
              }}
            >
              {prov.name}
            </button>
          </li>
        );

        if (isMc) return ret;

        return ret.concat(prov.sub.map((subcode) => {
          const city = raw[subcode];

          return (
            <li
              key={subcode}
              className={cx('item-city', {
                active: subcode === selected,
                hide: !prov.unfold,
              })}
            >
              <button
                onClick={() => {
                  if (selected !== subcode) {
                    props.selectCity(subcode);
                  }
                }}
              >
                {city.name}
              </button>
            </li>
          );
        }));
      })}
    </ul>
  );
};

const mapStateToProps = R.pipe(
  R.path(['city']),
  R.pick(['raw', 'list', 'selected'])
);

City.propTypes = {
  raw: PropTypes.object,
  list: PropTypes.arrayOf(PropTypes.string),
  selected: PropTypes.string,
  // selectCity: PropTypes.func,
  // toggleAccordion: PropTypes.func,
};

export default connect(mapStateToProps, {
  selectCity,
  toggleAccordion,
})(City);

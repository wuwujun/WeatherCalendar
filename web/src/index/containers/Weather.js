import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';

import iconMap from '../utils/weatherIconMap';

const Weather = (props) => {
  const { now, future, suggestion: su, city } = props;

  return (
    <div>
      <h1 className="cityName">
        {city ? city.name : '数据加载中' }
      </h1>
      <section>
        <div className="temp-current">
          <span>{now.temperature} ℃</span>
        </div>
        <div className="cond-current">
          <span>
            <img alt={now.text} src={iconMap(now.code)} />
          </span>
          <span>{now.text}</span>
        </div>
      </section>
      <section>
        {future.map(day => (
          <div
            key={day.date}
            className="forecast"
          >
            <span>{day.high} - {day.low}</span>
            <span>
              <img alt={day.text_day} src={iconMap(day.code_day)} />
            </span>
            <span>{day.text_day}</span>
            <span>
              <img alt={day.text_night} src={iconMap(day.code_night)} />
            </span>
            <span>{day.text_night}</span>
            <span>{day.wind_direction}风 {day.wind_scale}级</span>
          </div>
        ))}
      </section>
      <section>
        {(su && su.flu && su.sport && su.travel && su.dressing && su.uv) ? (
          <ul>
            <li>感冒 {su.flu.brief}</li>
            <li>运动 {su.sport.brief}</li>
            <li>旅游 {su.travel.brief}</li>
            <li>衣着 {su.dressing.brief}</li>
            <li>紫外线{su.uv.brief}</li>
          </ul>
        ) : null}
      </section>
    </div>
  );
};

const mapStateToProps = (state) => {
  const {
    weather: {
      now,
      future,
      suggestion,
    },
    city: {
      raw,
      selected,
    }
  } = state;

  return {
    now,
    future,
    suggestion,
    city: raw[selected],
  };
};

Weather.propTypes = {
  now: PropTypes.object,
  future: PropTypes.array,
  suggestion: PropTypes.object,
  city: PropTypes.object,
};

export default connect(mapStateToProps)(Weather);

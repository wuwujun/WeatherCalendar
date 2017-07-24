import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import moment from 'moment';

import Link from 'react-router-dom/Link';
import iconMap from '../utils/weatherIconMap';
import digitMap from '../utils/digitMap';
import bridge from '../utils/bridge';

const Weather = (props) => {
  const { now, future, suggestion: su, city, task } = props;
  const today = moment();
  today.startOf('day');

  const stt = today.valueOf();
  const tasks = Object.keys(task).sort().filter(d => d > stt).slice(0, 3)
    .map(d => task[d]);

  return (
    <section className="weather-container">
      <header className="row">
        <h1 className="space city-name">
          {city ? city.name : '数据加载中' }
        </h1>
        <div className="item raw">
          <Link to="/city" className="goto-city-select">切换城市</Link>
        </div>
        <div className="item raw">
          <button
            className="goto-share-weather"
            onClick={() => {
              const day = future[0];
              const text = [
                `${today.format('M月D日')} 星期${digitMap(today.weekday(), 'week')} ${city.name} 天气状况：`,
                `白天 ${day.text_day} 最高温度${day.high}℃`,
                `夜间 ${day.text_night} 最低温度${day.low}℃`,
                `紫外线${su.uv.brief} ${su.sport.brief}运动 ${su.travel.brief}旅游`,
              ].join('\n');
              bridge.shareText(text);
            }}
          >
            分享天气
          </button>
        </div>
      </header>
      <section className="line current-block">
        <div className="row">
          <div className="space">
            <div className="date-current">
              {today.format('YYYY年M月D日')} 星期{digitMap(today.weekday(), 'week')}
            </div>
            <div className="row">
              <div className="item">
                <span className="temp-current">{now.temperature}</span>
                <span className="temp-current-unit">℃</span>
              </div>
              <div className="space cond-current">
                <div className="">{now.text}</div>
              </div>
            </div>
          </div>
          <div className="item">
            <div className="icon-current">
              <img alt={now.text} src={iconMap(now.code)} />
            </div>
          </div>
        </div>
      </section>
      <section className="ferocast-block">
        <div className="row">
          {future.map((day, i) => {
            const t = moment(today).add(i, 'day');
            return (
              <div
                key={day.date}
                className="item forecast"
              >
                <div className="date">
                  <div>{t.format('M月D日')}</div>
                  <div>星期{digitMap(t.weekday(), 'week')}</div>
                </div>
                <div className="forecast-day">
                  <div><span className="text">白天 </span>{day.text_day}</div>
                  <div><span className="text">最高 </span>{day.high}℃</div>
                  <div className="icon">
                    <img alt={day.text_day} src={iconMap(day.code_day)} />
                  </div>
                </div>
                <div className="forecast-night">
                  <div><span className="text">夜间 </span>{day.text_night}</div>
                  <div><span className="text">最低 </span>{day.low}℃</div>
                  <div className="icon">
                    <img alt={day.text_night} src={iconMap(day.code_night)} />
                  </div>
                </div>
                <div className="forecast-wind">
                  <span>{day.wind_direction}风{digitMap(day.wind_scale)}级</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section>
        <header className="life-suggestion-tip">
          生活小提示
        </header>
        {(su && su.flu && su.sport && su.travel && su.dressing && su.uv) ? (
          <ul className="life-suggestion">
            <li>紫外线{su.uv.brief}</li>
            <li>{su.sport.brief}运动</li>
            <li>{su.travel.brief}旅游</li>
            <li>感冒{su.flu.brief}</li>
            <li style={{ gridColumn: 'span 2' }}>适合的衣物类型: {su.dressing.brief}</li>
          </ul>
        ) : null}
      </section>
      <section>
        {tasks.map((ta) => {
          const t = moment(ta.time);
          return (
            <article key={ta.time} className="task">
              <h3 className="row">
                <div className="space">{t.format('YYYY年M月D日 星期')}{digitMap(t.weekday(), 'week')}{t.format(' HH:mm')}</div>
                <button
                  className="item"
                  onClick={() => bridge.addEvent(+ta.time, ta.text)}
                >提醒</button>
              </h3>
              <div className="text">{ta.text}</div>
            </article>
          );
        })}
        <div className="no-task-tip">
          <button onClick={() => props.history.push('/schedule')}>
            {tasks.length ? ' ' : '近期没有行程'} 点击查看更多
          </button>
        </div>
      </section>
    </section>
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
    },
    schedule: {
      task,
    },
  } = state;

  return {
    now,
    future,
    suggestion,
    city: raw[selected],
    task,
  };
};

Weather.propTypes = {
  history: PropTypes.object,
  now: PropTypes.object,
  future: PropTypes.array,
  suggestion: PropTypes.object,
  city: PropTypes.object,
  task: PropTypes.object,
};

export default connect(mapStateToProps)(Weather);

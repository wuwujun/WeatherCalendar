import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import R from 'ramda';
import cx from 'classnames';
import moment from 'moment';

import { setToday } from '../actions/schedule';

import digitMap from '../utils/digitMap';

const weekheads = [0, 1, 2, 3, 4, 5, 6].map(i => digitMap(i, 'week'));
const n42 = ' '.repeat(42).split('');

const Schedule = (props) => {
  const trueToday = moment();
  const startMonth = moment(props.today).startOf('month');
  const endMonth = moment(startMonth).endOf('month');

  const timeList = Object.keys(props.task).map(d => +d).filter(d => startMonth.isSameOrBefore(d) && endMonth.isSameOrAfter(d));

  const daysOfMonth = endMonth.diff(startMonth) + 1;
  const itstt = moment(startMonth).subtract(
    startMonth.weekday() + ((startMonth.weekday() === 0 || daysOfMonth === 28) ? 7 : 0),
    'day'
  );
  const itend = moment(itstt).endOf('day');

  return (
    <section className="calendar-container">
      <header className="row calendar-op">
        <button
          className="space last-month"
          onClick={() => {
            const t = moment(props.today).subtract(1, 'month');
            props.setToday(t.valueOf());
          }}
        >上月</button>
        <button
          className="space next-month"
          onClick={() => {
            const t = moment(props.today).add(1, 'month');
            props.setToday(t.valueOf());
          }}
        >下月</button>
        <button
          className="space today"
          onClick={() => {
            props.setToday(trueToday.valueOf());
          }}
        >今天</button>
        <button
          className="space return"
          onClick={() => props.history.push('/index.html')}
        >返回</button>
      </header>
      <section>
        <h1 className="calendar-month">
          {startMonth.format('YYYY').split('').map(digitMap)}年
          {' '}
          {digitMap(startMonth.month() + 1)}月
        </h1>
      </section>
      <section className="calendar">
        {weekheads.map(head => (
          <div
            key={head}
            className="calendar-head"
          >
            <button>{head}</button>
          </div>
        ))}
        {n42.map(() => {
          const inMonth = itstt.isSameOrAfter(startMonth) && itstt.isSameOrBefore(endMonth);
          const inToday = itstt.isSameOrBefore(trueToday) && itend.isSameOrAfter(trueToday);
          const hasTask = timeList.some(d => itstt.isSameOrBefore(d) && itend.isSameOrAfter(d));
          const time = itstt.valueOf();

          const ret = (
            <div
              key={itstt.valueOf()}
              className={cx('calendar-day', {
                'has-task': hasTask,
                today: inToday,
                out: !inMonth,
              })}
            >
              <button
                onClick={() => {
                  if (inMonth) {
                    props.history.push(`/task/${time}/0`);
                  }
                  props.setToday(time);
                }}
              >
                <div className="date">{inToday ? '今天' : itstt.date()}</div>
                {hasTask ? <div className="has-task-text">查看</div> : null}
              </button>
            </div>
          );
          // step 1 day
          itstt.add(1, 'day');
          itend.add(1, 'day');
          return ret;
        })}
      </section>
    </section>
  );
};

Schedule.propTypes = {
  history: PropTypes.object,
  task: PropTypes.object,
  today: PropTypes.number,
  setToday: PropTypes.func,
};

const mapStateToProps = R.pipe(R.path(['schedule']), R.pick(['task', 'today']));

export default connect(mapStateToProps, {
  setToday,
})(Schedule);

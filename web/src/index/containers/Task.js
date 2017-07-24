/* eslint react/no-array-index-key: "off" */

import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import moment from 'moment';

import {
  editTask,
  resetEdit,
  setTask,
  delTask,
} from '../actions/schedule';

const hours = ' '.repeat(24).split('');
const minutes = ' '.repeat(6).split('');

const Task = (props) => {
  const { task, edit, time, edittime, editmode } = props;

  const today = moment().startOf('day');
  const current = moment(+time).startOf('day');
  const nextDay = moment(current).add(1, 'day');

  const list = Object.keys(task).map(d => +d).filter(d => current.isSameOrBefore(d) && nextDay.isAfter(d)).sort();

  return (
    <setction className="task-container">
      <header className="row">
        <div className="space">
          <button
            onClick={() => {
              if (!edit.text) return;

              const t = moment(current);
              t.hour(edit.hour);
              t.minute(edit.minutes);

              while (task[t.valueOf()]) {
                t.add(1, 'ms');
              }

              props.setTask(edittime, {
                time: t.valueOf(),
                text: edit.text,
              });
              if (editmode) {
                props.history.replace(`/task/${time}/0`);
              }
            }}
          >{editmode ? '编辑' : '创建'}</button>
        </div>
        {editmode ? (
          <div className="space">
            <button
              onClick={() => {
                props.resetEdit();
                props.history.replace(`/task/${time}/0`);
              }}
            >取消</button>
          </div>
        ) : null}
        <div className="space return" style={{ textAlign: 'right' }}>
          <button
            onClick={() => props.history.goBack()}
          >返回</button>
        </div>
      </header>
      {(current.isSameOrAfter(today) || editmode) ? (
        <section className="new-task">
          <div className="row select-row">
            <div className="space select-time-hour">
              <select
                id="edit-select-time-hour"
                name="edit-select-time-hour"
                autoComplete="off"
                value={edit.hour}
                onChange={(ev) => {
                  if (ev.target.value !== edit.hour) {
                    props.editTask(['task', edittime, 'hour'], ev.target.value);
                  }
                }}
              >
                {hours.map((_, i) => (
                  <option key={i} value={`00${i}`.slice(-2)}>{`00${i}`.slice(-2)}</option>
                ))}
              </select>
            </div>
            <div className="item raw">时</div>
            <div className="space select-time-minute">
              <select
                id="edit-select-time-minute"
                name="edit-select-time-minute"
                autoComplete="off"
                value={edit.minute}
                onChange={(ev) => {
                  if (ev.target.value !== edit.minute) {
                    props.editTask(['task', edittime, 'minute'], ev.target.value);
                  }
                }}
              >
                {minutes.map((_, i) => (
                  <option key={i} value={`00${i * 10}`.slice(-2)}>{`00${i * 10}`.slice(-2)}</option>
                ))}
              </select>
            </div>
            <div className="item raw">分</div>
          </div>
          <div className="edit-text-holder">
            <textarea
              id="edit-text"
              name="edit-text"
              autoComplete="off"
              className="edit-text"
              rows="3"
              placeholder="输入计划内容"
              value={edit.text}
              onChange={(ev) => {
                if (ev.target.value !== edit.text) {
                  props.editTask(['task', edittime, 'text'], ev.target.value);
                }
              }}
            />
          </div>
        </section>
      ) : null}
      <section>
        {list.map(d => (
          <article key={d} className="task">
            <h3 className="row">
              <div className="space">{moment(d).format('HH:mm')}</div>
              <button
                className="item edit-task"
                onClick={() => {
                  props.delTask(d);
                }}
              >删除</button>
              <button
                className="item edit-task"
                onClick={() => {
                  const t = moment(d);
                  props.setTask(d, {
                    time: d,
                    text: task[d].text,
                    hour: `00${t.hour()}`.slice(-2),
                    minute: `00${t.minute()}`.slice(-2),
                  });
                  props.history.replace(`/task/${time}/${d}`);
                }}
              >编辑</button>
            </h3>
            <div className="text">{task[d].text}</div>
          </article>
        ))}
      </section>
    </setction>
  );
};

const mapStateToProps = (state, props) => {
  const {
    schedule: {
      task,
    }
  } = state;

  const {
    match: {
      params: {
        time,
        edittime,
      },
    },
  } = props;

  return {
    edittime,
    time,
    task,
    edit: task[edittime],
    editmode: edittime !== '0',
  };
};

Task.propTypes = {
  history: PropTypes.object,
  time: PropTypes.string,
  edittime: PropTypes.string,
  task: PropTypes.object,
  edit: PropTypes.object,
  editmode: PropTypes.bool,
  editTask: PropTypes.func,
  setTask: PropTypes.func,
  delTask: PropTypes.func, // eslint-disable-line
  resetEdit: PropTypes.func,
};

export default connect(mapStateToProps, {
  editTask,
  setTask,
  delTask,
  resetEdit,
})(Task);

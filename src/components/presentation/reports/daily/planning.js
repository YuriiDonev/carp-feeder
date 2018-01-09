import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Link,
  browserHistory,
} from 'react-router';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ProductivityLine from '../productivityLine';

import {
  setUserLink,
  changeUser,
} from '../../../../actions/filters';

const actions = {
  setUserLink,
  changeUser,
};

class DailyReportsPlanning extends Component {
  static PropTypes = {
    setUserLink: PropTypes.func,
    changeUser: PropTypes.func,
    user: PropTypes.object,
    planning: PropTypes.object,
    index: PropTypes.number,
    planningsCount: PropTypes.number,
    totalUser: PropTypes.string,
    activities: PropTypes.object,
    totalUserSeconds: PropTypes.number,
  }

  shouldComponentUpdate(nextProps) {
    if (!_.isEqual(this.props, nextProps)) return true;
    return false;
  }

  linkToTimesheets = () => {
    this.props.setUserLink(true);
    this.props.changeUser(this.props.planning.UserID);
    browserHistory.push('/admin/teamStats/timesheets');
  }

  mapActivities = () => {
    let activities = [],
      totalActivities = 0,
      topActivity = {
        Name: '',
        Duration: 0,
      };
    for (const key in this.props.activities) {
      totalActivities += this.props.activities[key];
      activities.push({
        Name: key,
        Duration: this.props.activities[key],
      });
      if (this.props.activities[key] > topActivity.Duration) {
        topActivity = {
          Name: key,
          Duration: this.props.activities[key],
        };
      }
    }
    return {
      activities,
      topActivity,
      totalActivities,
    };
  }

  render() {
    const {
      user,
      planning,
      planningsCount,
      index,
      totalUser,
      totalUserSeconds,
    } = this.props;
    const {
      activities,
      topActivity,
      totalActivities,
    } = this.mapActivities();
    const singlePlanning = moment.duration(planning.totalSpentPlanning, 'seconds').asHours().toFixed(2);
    return (
      <tr>
        {index === 0 &&
          <td className='member-total' rowSpan={planningsCount} title={user.name} colSpan='2'>
            <div className='member-total-wrapper'>
              <div className='member'>
                <div className='member-name' onClick={this.linkToTimesheets}>{user.name}</div>
                <div className='member-email'>{user.email}</div>
              </div>
              <div className='total'>
                <div className='time-block'>
                  <div className='time-block-icon'>
                    <i className='icon-clock' />
                  </div>
                  <div className='time-block-total'>
                    <span className='time-block-total-value'>{totalUser}</span>
                    <div className='time-block-total-range'>by day</div>
                  </div>
                </div>
              </div>
            </div>
            <ProductivityLine duration={totalActivities} activity={activities} />
          </td>
        }
        <td className='task'>
          <Link target='_blank' href={planning.IssueURL} title='Open at tracker'>
            {planning.IssueTitle}
          </Link>
        </td>
        <td>
          <div className={`activity ${topActivity.Name || 'nodata'}`}>
            {(topActivity.Name.slice(0, 1).toUpperCase() + topActivity.Name.slice(1)) || 'No data'}
          </div>
        </td>
        <td className='activity-hours'>
          {singlePlanning}
        </td >
        <td className='notes'>
          <ul>
            <li>{planning.OpenComment}</li>
            <li>{planning.CloseComment}</li>
          </ul>
        </td>
      </tr>
    );
  }
}

export default connect(null, actions)(DailyReportsPlanning);

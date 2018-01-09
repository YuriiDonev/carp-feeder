import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router';
import moment from 'moment';
import PropTypes from 'prop-types';
import _ from 'lodash';

class DailyReportsProjectHeader extends Component {
  static PropTypes = {
    t: PropTypes.func,
    project: PropTypes.object,
  };

  shouldComponentUpdate(nextProps) {
    if (!_.isEqual(this.props.project, nextProps.project)) return true;
    return false;
  }

  render() {
    const {
      t,
      project,
    } = this.props;
    const time = moment.duration(project.totalSpentProject, 'seconds').asHours().toFixed(2);
    return (
      <div className='daily-header clearfix'>
        <div className='title-block'>
          <div className='title-block-activity'>{t('Daily activity')}</div>
          <div className='title-block-project'>
            <span>in</span>
            <Link
              to={`/admin/settings/project/${project.trackerID}/${project.projectID}`}
              className='title-block-project-name'
            >
              {project.name}
            </Link>
          </div>
        </div>
        <div className='time-block'>
          <div className='time-block-icon'>
            <i className='icon-clock' />
          </div>
          <div className='time-block-total'>
            <span className='time-block-total-value'>{time}</span>
            <div className='time-block-total-range'>{t('by day')}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default translate(['Dashboard'])(DailyReportsProjectHeader);

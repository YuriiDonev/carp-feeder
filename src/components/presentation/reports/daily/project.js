import React, { Component } from 'react';
import { translate } from 'react-i18next';
import moment from 'moment';
import _ from 'lodash';
import PropTypes from 'prop-types';

import DailyReportsProjectHeader from './projectHeader';
import DailyReportsPlanning from './planning';
import Select from '../../common/select/index';

import {
  sortPlanningsByTotalSpent,
  sortUserPlanningsByTotalSpent,
  PRODUCTIVITY_OPTIONS,
} from '../../../../helpers/reports';

class DailyReportsProject extends Component {
  static PropTypes = {
    t: PropTypes.func,
    users: PropTypes.array,
    project: PropTypes.object,
  }

  constructor() {
    super();
    this.state = {
      userSort: 'asc',
      projectScale: 'name',
      projectOrder: 'asc',
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(this.props.users, nextProps.users)) return true;
    if (!_.isEqual(this.props.project, nextProps.project)) return true;
    if (!_.isEqual(this.state, nextState)) return true;
    return false;
  }

  changeProjectSort = option => {
    const [scale, order] = option.split(' ');
    this.setState({
      projectScale: scale,
      projectOrder: order,
    });
  }

  changeUserSort = option => {
    this.setState({
      userSort: option,
    });
  }

  renderUserPlannings = () => {
    const sortedProjectPlannings = sortPlanningsByTotalSpent(this.props.project.planningsProject, this.state.projectScale, this.state.projectOrder);
    return _.map(sortedProjectPlannings, (user, i) => {
      const totalUser = moment.duration(user.totalSpentUser, 'seconds').asHours().toFixed(2);
      const sortedUserPlannings = sortUserPlanningsByTotalSpent(user.planningsUser, this.state.userSort);
      return sortedUserPlannings.map((planning, k) => (
        <DailyReportsPlanning
          key={`${i}-${k}`}
          planning={planning}
          user={user.userData}
          planningsCount={user.planningsUser.length}
          index={k}
          totalUser={totalUser}
          totalUserSeconds={user.totalSpentUser}
          activities={user.activitiesUser}
        />
        ));
    });
  }

  render() {
    const { t } = this.props;

    return (
      <div className='daily-table-holder'>
        <DailyReportsProjectHeader project={this.props.project} />
        <table className='table daily-table'>
          <thead>
            <tr>
              <th className='member'>
                <div>
                  <div>
                    {t('Member')}
                  </div>
                  <Select
                    type='PRODUCTIVITY'
                    multi={false}
                    options={PRODUCTIVITY_OPTIONS}
                    value={`${this.state.projectScale} ${this.state.projectOrder}`}
                    onChange={this.changeProjectSort}
                    disableUnselectOption
                  />
                </div>
              </th>
              <th className='total'>
                <div className='sort-holder'>
                  <button className='up' data-param='time' data-direction='up' onClick={() => this.changeProjectSort('total desc')} />
                  <button className='down' data-param='time' data-direction='down' onClick={() => this.changeProjectSort('total asc')} />
                </div>
                <span>{t('Total')}</span>
              </th>
              <th className='task'>{t('Task')}</th>
              <th className='activity'>{t('Activity')}</th>
              <th className='activity-hours'>
                <div className='sort-holder'>
                  <button className='up' data-param='time' data-direction='up' onClick={() => this.changeUserSort('desc')} />
                  <button className='down' data-param='time' data-direction='down' onClick={() => this.changeUserSort('asc')} />
                </div>
                <span>{t('Activity Hours')}</span>
              </th>
              <th className='notes'>{t('Notes')}</th>
            </tr>
          </thead>
          <tbody>
            {this.renderUserPlannings()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default translate(['Dashboard'])(DailyReportsProject);

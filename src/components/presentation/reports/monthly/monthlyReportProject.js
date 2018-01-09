import React, { PureComponent } from 'react';
import Hammer from 'react-hammerjs';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import TrRightComponent from '../trRightComponent';
import TrLeftComponent from '../trLeftComponent';
import RenderHeaders from '../headers';

import Select from '../../common/select/index';
import {
  reportsDataRound,
  PRODUCTIVITY_OPTIONS,
} from '../../../../helpers/reports';

class MonthlyReportProjects extends PureComponent {
  static PropTypes = {
    t: PropTypes.func,
    reports: PropTypes.objectOf(PropTypes.shape({
      byProject: PropTypes.object,
      byUsers: PropTypes.object,
      days: PropTypes.object,
    })),
    projectKey: PropTypes.string,
  }

  constructor() {
    super();

    this.state = {
      sort: {
        order: 'asc',
        scale: 'name',
        data: '',
      },
    };
  }

  sortHandler = (scale, order, day = '') => {
    this.setState({ sort: {
      day,
      scale,
      order,
    } });
  }

  clickHandler = e => {
    this.sortHandler(e.target.dataset.sortingKey, e.target.dataset.direction, e.target.dataset.day);
  }

  changeProjectSort = option => {
    const [scale, order] = option.split(' ');
    this.sortHandler(scale, order);
  }

  sortUsers = () => {
    const reports = this.props.reports;
    const key = this.props.projectKey;
    return _.orderBy(reports.byProject[this.props.projectKey].users, userID => {
      const user = reports.byUsers[userID];
      switch (this.state.sort.scale) {
        case 'total':
          return user.total[key];
        case 'timeTotalDay':
          return _.get(user.days[this.state.sort.day], 'all', 0);
        case 'name':
          return user.name.toLowerCase();
        case 'communication':
        case 'entertainment':
        case 'other':
        case 'social':
        case 'work':
          if (user.Activities.total) {
            return _.get(user.Activities.activities[this.state.sort.scale.toUpperCase()], 'Duration', 0) / user.Activities.total;
          } else {
            return 0;
          }
        default:
          return user.total.all;
      }
    }, this.state.sort.order);
  }

  render() {
    const { t, reports } = this.props;

    const key = this.props.projectKey;
    const sortedUsers = this.sortUsers();

    return (
      <div className='report-each-table'>
        <h3 className='report-header'><span className='report-sub-header'>{reports.byProject[key].name}</span><button className='export-csv' onClick={() => this.exportCSVSingle(key)}><i className='icon-report' />{t('Export CSV')}</button></h3>
        <div className='mon-mix-main'>
          <div className='row row-table'>
            <div className='fixed-table'>
              <table className='table report-table'>
                <colgroup>
                  <col width='260' />
                </colgroup>
                <thead>
                  <tr>
                    <th>
                      <div className='row'>
                        <span>{t('User')}</span>
                        <Select
                          type='PRODUCTIVITY'
                          multi={false}
                          options={PRODUCTIVITY_OPTIONS}
                          value={`${this.state.sort.scale} ${this.state.sort.order}`}
                          onChange={this.changeProjectSort}
                          disableUnselectOption
                        />
                        <div>
                          <div className='sort-holder' onClick={this.clickHandler}>
                            <button className='up' data-sorting-key='total' data-direction='desc' data-project={key} />
                            <button className='down' data-sorting-key='total' data-direction='asc' data-project={key} />
                          </div>
                          <span>{t('Total')}</span>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(sortedUsers, (user, pkey) => (
                    <TrLeftComponent
                      key={pkey}
                      trKey={user + key}
                      trSpentTime={reportsDataRound((reports.byUsers[user].total[key]) / 3600)}
                      trUser={reports.byUsers[user]}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className='report-table-overflowed' >
              <Hammer
                onPan={this.handlePan}
                onPanStart={this.handlePanStart}
                onPanEnd={this.handlePanEnd}
              >
                <table className='table'>
                  <thead>
                    <RenderHeaders days={reports.days} cb={this.sortHandler} tableKey={key} />
                  </thead>
                  <tbody className='weekly'>
                    {_.map(sortedUsers, (user, pkey) => (
                      <TrRightComponent
                        key={`${user}_${key}_${pkey}`}
                        trKey={user + key}
                        trData={reports.byUsers[user]}
                        trProject={key}
                      />
                    ))}
                  </tbody>
                </table>
              </Hammer>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default translate(['Dashboard'])(MonthlyReportProjects);

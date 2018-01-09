import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Hammer from 'react-hammerjs';

import NoDataPlaceholder from '../common/noDataPlaceholder';
import TrLeftComponent from './trLeftComponent';
import TrRightComponent from './trRightComponent';
import RenderHeaders from './headers';

import {
  reportsDataRound,
  CreateCSV,
  PRODUCTIVITY_OPTIONS,
} from './../../../helpers/reports';
import DownloadTimeguard from '../../downloadTimeguard';
import Select from './../common/select/index';

const mapStateToProps = ({ reports: { allTime }, filters }) => ({
  allTime,
  filters,
});

class MainReport extends Component {
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

  getWidth() {
    if (document.getElementById('parent-div') === null || document.getElementById('right-table') === null) {
      return null;
    } else {
      const tableParentWidth = document.getElementById('parent-div').clientWidth;
      const tableWidth = document.getElementById('right-table').scrollWidth;
      const widthForDrag = tableParentWidth - tableWidth - 20;
      return widthForDrag;
    }
  }

  positionX = 0;

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

  handlePanStart = event => {
    this.positionX -= event.deltaX;
  }

  handlePan = event => {
    const parent = document.getElementById('parent-div');
    parent.scrollLeft = this.positionX - event.deltaX;
  }

  handlePanEnd = event => {
    this.positionX -= event.deltaX;
  }

  exportCSV = () => {
    const csv = new CreateCSV;
    const reports = this.props.allTime;
    csv.mainTitle(reports.days)
    _.forEach(reports.byUsers, user => {
      csv.rowTimeUser(user, 'all')
    })
    csv.saveCSV()
  }

  render() {
    const reports = this.props.allTime;
    let totalWeek = 0;
    const { t } = this.props;
    const sortedUser = reports && !_.isEmpty(reports.byUsers) && _.orderBy(reports.byUsers, user => {
      switch (this.state.sort.scale) {
        case 'total':
          return user.total.all;
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

    if (reports && !_.isEmpty(reports.byUsers)) {
      _.forEach(reports.byUsers, user => { totalWeek += user.total.all; });
    }

    return (
      <div>
        <h3 className='report-header'>
          <button className='export-csv' onClick={this.exportCSV}>
            <i className='icon-report' /> {t('Export CSV')}
          </button>
        </h3>
        { (this.props.allTime === undefined || _.isEmpty(this.props.allTime.byUsers)) ?
          <NoDataPlaceholder
            iconUrl='/admin/style/imgs/placeholders/ic_lamp_productivity_48_71.svg'
            additionalClass='reports-placeholder'
            actionSuggestion={
              <span>
                Oops. You don't have any data for this date <br />
                <DownloadTimeguard noIcon linkText='Open TimeGuard Desktop' /> and
                let's have some working session.
              </span>
            }
          />
          :
          <div className='widget monthly'>
            <div className='mon-mix-main'>
              <div className='row row-table'>
                <div className='fixed-table'>
                  <table className='table report-table'>
                    <colgroup>
                      <col width='260' />
                    </colgroup>
                    <tfoot>
                      <tr>
                        <td className='total-hours-right'>
                          <div className='row'>
                            {this.props.monthly ? 'Total hours' : 'Weekly total '}
                            <div>
                              <span><i className='icon-clock' /></span>
                              <span>{ (reportsDataRound(totalWeek / 3600) != 0.00) ? reportsDataRound(totalWeek / 3600) : ' - ' }<span className='add-info'>{this.props.monthly ? 'by month' : 'by week'}</span></span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                    <thead>
                      <tr>
                        <th>
                          <div className='row'>
                            <span className='report-table-under-totalhours member weekly'>Member</span>
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
                                <button className='up' data-sorting-key='total' data-direction='desc' />
                                <button className='down' data-sorting-key='total' data-direction='asc' />
                              </div>
                              <span className='report-table-under-totalhours total weekly'>Total</span>
                            </div>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        _.map(sortedUser, (user, key) => (
                          <TrLeftComponent
                            key={key}
                            trKey={key}
                            trUser={user}
                            monthly={this.props.monthly}
                            trSpentTime={(reportsDataRound(parseInt(user.total.all) / 3600)) != 0.00
                            ? (reportsDataRound(parseInt(user.total.all) / 3600))
                            : ' - '}
                          />
                          ))
                      }
                    </tbody>
                  </table>
                </div>
                <div className='report-table-overflowed' id='parent-div'>
                  <Hammer
                    onPan={this.handlePan}
                    onPanStart={this.handlePanStart}
                    onPanEnd={this.handlePanEnd}
                  >
                    <table className='table'>
                      <tfoot>
                        { reports &&
                        <tr>
                          {_.map(reports.days, (day, index) => (<td className='monthly-table-footer' key={index}>{ (reportsDataRound(parseInt(day.all) / 3600) != 0.00) ?
                            reportsDataRound(parseInt(day.all) / 3600) : ' - ' }
                            <span className='add-info'>by day</span></td>))}
                        </tr>}
                      </tfoot>
                      <thead>
                        {
                          !_.isEmpty(this.props.allTime.days) &&
                          <RenderHeaders days={this.props.allTime.days} cb={this.sortHandler} />}
                      </thead>
                      <tbody className='weekly'>
                        { sortedUser.map((user, key) => <TrRightComponent key={key} trKey={key} trData={user} />) }
                      </tbody>
                    </table>
                  </Hammer>
                </div>
              </div>
            </div>
          </div>
          }
      </div>
    );
  }
}

export default connect(mapStateToProps)(translate(['Dashboard'])(MainReport));

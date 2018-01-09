import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Hammer from 'react-hammerjs';

import { reportsDataRound, CreateCSV } from '../../../../helpers/reports';
import ClearPagePlaceholder from '../../clearPagePlaceholder';
import ProductivityLine from '../productivityLine';
import TrRightComponent from '../trRightComponent';
import TrLeftComponent from '../trLeftComponent';
import RenderHeaders from '../headers';

const mapStateToProps = ({ reports: { allTime }, filters }) => ({
  allTime,
  filters,
});

export class MonthlyReportUsers extends Component {

  static propTypes = {
    allTime: PropTypes.shape({
      byUsers: PropTypes.objectOf(PropTypes.shape({
        email: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })),
      byProject: PropTypes.objectOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        users: PropTypes.arrayOf(PropTypes.number).isRequired,
      })),
      days: PropTypes.objectOf(PropTypes.shape({
        all: PropTypes.number.isRequired,
      })),
    }).isRequired,
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      sort: {},
    };
  }

  positionX = 0;

  sortHandler = (sortingKey, dir, day = '', user) => {
    this.setState({
      sort: {
        ...this.state.sort,
        [user]: {
          day,
          sortingKey,
          direction: dir !== 'up',
        },
      },
    });
  }

  clickHandler = e => {
    this.sortHandler(
      e.target.dataset.sortingKey,
      e.target.dataset.direction,
      e.target.dataset.day,
      e.target.dataset.user,
    );
  }

  handlePanStart = event => {
    this.positionX -= event.deltaX;
  }

  handlePan = event => {
    const parent = event.target.closest('.report-table-overflowed');
    parent.scrollLeft = this.positionX - event.deltaX;
  }

  handlePanEnd = event => {
    this.positionX -= event.deltaX;
  }

  exportCSVTotal = () => {
    const csv = new CreateCSV();
    const reports = this.props.allTime;
    csv.mainTitle(reports.days);
    _.forEach(reports.byUsers, user => {
      csv.rowTitle(user.name);
      user.projects.forEach(project => {
        csv.rowTimeProject(user, project, reports.byProject[project].name);
      });
    });
    csv.saveCSV();
  }

  exportCSVSingle = key => {
    const csv = new CreateCSV();
    const reports = this.props.allTime;
    const user = reports.byUsers[key];
    csv.mainTitle(reports.days);
    csv.rowTitle(user.name);
    user.projects.forEach(project => {
      csv.rowTimeProject(user, project, reports.byProject[project].name);
    });
    csv.saveCSV();
  }

  sortData = (user, key) => _.sortBy(user.projects, project => {
    switch (this.state.sort.sortingKey) {
      case 'timeTotalUser':
        return user.total[project];
      case 'timeTotalDay':
        return _.get(user.days[this.state.sort[key].day], project, 0);
      default:
        return this.props.allTime.byProject[project].name;
    }
  })

  render() {
    const { t } = this.props;
    const reports = this.props.allTime;
    const sortedUser = {};
    _.map(reports.byUsers, (user, key) => {
      const projects = this.sortData(user, key);
      if (this.state.sort[key] && !this.state.sort[key].direction) projects.reverse();

      sortedUser[key] = {
        ...user,
        projects,
      };
    });

    return (
      <div>
        { _.isEmpty(reports.byUsers) ?
          <ClearPagePlaceholder>
            <p>{t("You don't have any data for today.")}</p>
          </ClearPagePlaceholder> :
          <div>
            <h2 className='report-header'>
              <span className='report-sub-header'>{t('Users Reports Table')}</span>
              <button className='export-csv' onClick={this.exportCSVTotal}>
                <i className='icon-report' /> {t('Export CSV')}
              </button>
            </h2>
            {_.map(sortedUser, (user, key) => (
              <div className='report-each-table' key={key}>
                <div className='user-montly-report--header'>
                  <div className='header-user-data'>
                    <h3 className='report-header'> <span className='report-sub-header'>{user.name}</span> </h3>
                    <span className='header-email'>{user.email}</span>
                  </div>
                  <div className='header-buttons'>
                    <button className='export-csv' onClick={() => this.exportCSVSingle(key)}>
                      <i className='icon-report' />
                      {t('Export CSV')}
                    </button>
                  </div>
                </div>
                <ProductivityLine
                  activity={user.Activities.activities}
                  duration={user.Activities.total}
                />
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
                                <span>Project Name</span>
                                <div>
                                  <div className='sort-holder' onClick={this.clickHandler}>
                                    <button className='up' data-sorting-key='timeTotalUser' data-direction='up' data-user={key} />
                                    <button className='down' data-sorting-key='timeTotalUser' data-direction='down' data-user={key} />
                                  </div>
                                  <span>Total</span>
                                </div>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {_.map(user.projects, (project, pkey) => (
                            <TrLeftComponent
                              key={pkey}
                              trKey={key + pkey}
                              trSpentTime={reportsDataRound(user.total[project] / 3600)}
                              trUser={user}
                              trProject={reports.byProject[project].name}
                              trTrackerProjectIDs={project}
                            />
                        )) }
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
                          <thead>
                            {
                              !_.isEmpty(this.props.allTime.days) &&
                              <RenderHeaders
                                days={this.props.allTime.days}
                                cb={this.sortHandler}
                                tableKey={key}
                              />
                            }
                          </thead>
                          <tbody className='weekly'>
                            {_.map(user.projects, (project, i) => (
                              <TrRightComponent
                                key={i}
                                trKey={key + i}
                                trData={user}
                                trProject={project}
                              />
                              )) }
                          </tbody>
                        </table>
                      </Hammer>
                    </div>
                  </div>
                </div>
              </div>
              ))}
          </div>}
      </div>
    );
  }
}

export default connect(mapStateToProps)(translate(['Dashboard'])(MonthlyReportUsers));


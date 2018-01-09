import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import DailyReportsProject from './project';
import ReportsFilters from './filters';

import DownloadTimeguard from '../../../downloadTimeguard';
import NoDataPlaceholder from '../../common/noDataPlaceholder';

import { clearDailyReports } from '../../../../actions/reports';

const mapStateToProps = ({
  users,
  reports: { daily },
}) => ({
  users,
  daily,
});

const actions = {
  clearDailyReports,
};

class DailyReport extends Component {
  static PropTypes = {
    t: PropTypes.func,
    clearDailyReports: PropTypes.func,
    daily: PropTypes.objectOf(PropTypes.shape({
      byProjects: PropTypes.object,
    })),
    users: PropTypes.array,
  }

  shouldComponentUpdate(nextProps) {
    if (!_.isEqual(this.props.daily, nextProps.daily)) return true;
    if (!_.isEqual(this.props.users, nextProps.users)) return true;
    return false;
  }

  componentWillUnmount() {
    this.props.clearDailyReports();
  }

  renderProjects() {
    return _.map(this.props.daily.byProjects, (tracker, i) => _.map(tracker, (project, k) => (<DailyReportsProject project={project} key={`${i}-${k}`} users={this.props.users} />)));
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <div className='widget'>
          <ReportsFilters userFilter='MULTI' projectFilter='MULTI' dateFilter='SINGLE' />
          <div className='daily-reports'>
            {!_.isEmpty(this.props.daily.byProjects)
              ? this.renderProjects()
              :
              <NoDataPlaceholder
                iconUrl='/admin/style/imgs/placeholders/ic_lamp_productivity_48_71.svg'
                additionalClass='daily-reports-placeholder'
                actionSuggestion={
                  <span>
                      Oops. You don't have any data for this date <br />
                    <DownloadTimeguard noIcon linkText='Open TimeGuard Desktop' /> and
                        let's have some working session.
                    </span>
                  }
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(translate(['Dashboard'])(DailyReport));

import React, { Component } from 'react';
import { connect } from 'react-redux';

import ReportsFilters from './filters';
import MonthlyReportMixed from './monthlyReportMixed';
import MonthlyReportUsers from './monthlyReportUsers';
import MonthlyReportProjects from './monthlyReportProjects';

const mstp = ({ filters }) => ({
  reportsType: filters.reportsType,
});

class MonthlyReport extends Component {
  renderReportsView = () => {
    switch (this.props.reportsType) {
      case 'MIXED':
        return (<MonthlyReportMixed />);
      case 'USERS':
        return (<MonthlyReportUsers />);
      case 'PROJECTS':
        return (<MonthlyReportProjects />);
      default:
        return null;
    }
  }

  render() {
    return (
      <div>
        <div className='widget monthly' id='widget-monthly-weekly'>
          <ReportsFilters
            userFilter='MULTI'
            projectFilter='MULTI'
            dateFilter='MONTH'
            reportsTypeFilter
          />
          <div className='row reports-container'>
            {this.renderReportsView()}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mstp)(MonthlyReport);

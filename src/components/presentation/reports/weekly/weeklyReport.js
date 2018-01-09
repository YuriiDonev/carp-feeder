import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import ReportsFilters from './filters';
import MainReport from '../mainReport';

const mapStateToProps = ({ reports: { allTime }, filters }) => ({
  allTime,
  filters,
});

class WeeklyReport extends Component {
  render() {
    return (
      <div>
        <div className='widget monthly' id='widget-monthly-weekly'>
          <div className='row reports-container'>
            <ReportsFilters userFilter='MULTI' projectFilter='MULTI' dateFilter='WEEK' />
            <MainReport />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(translate(['Dashboard'])(WeeklyReport));

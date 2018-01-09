import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import MainReport from '../mainReport';

const mapStateToProps = ({ reports: { allTime }, filters }) => ({
  allTime,
  filters,
});

class MonthlyReportMixed extends Component {
  render() {
    const { t } = this.props;
    return (
      <div>
        <MainReport monthly />
      </div>
    );
  }
}

export default connect(mapStateToProps)(translate(['Dashboard'])(MonthlyReportMixed));

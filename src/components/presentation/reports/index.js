import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { translate } from 'react-i18next';

class ReportsIndex extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  }
  renderTabs() {
    const { t } = this.props;

    const tabsList = [
      { to: '/admin/reports/cold_start', name: t('Cold Start') },
      { to: '/admin/reports/daily', name: t('Daily') },
      { to: '/admin/reports/weekly', name: t('Weekly') },
      { to: '/admin/reports/monthly', name: t('Monthly') },
    ];

    return _.map(tabsList, (tab, i) => (<Link key={i} to={tab.to} className='tabLink' activeClassName='active'>{tab.name}</Link>));
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <div className='main-heading'><h2 className='page-title'><i className='icon-report header-icon-blue' />{t('Reports')}</h2></div>
        <div className='row stats-tabs'>
          {this.renderTabs()}
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default (translate(['Dashboard'])(ReportsIndex));

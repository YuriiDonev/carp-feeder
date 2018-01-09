import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { CreateCSV } from '../../../../helpers/reports';
import ClearPagePlaceholder from '../../clearPagePlaceholder';

import MonthlyReportProject from './monthlyReportProject';

const mapStateToProps = ({ reports, filters }) => ({
  reports,
  filters,
});


class MonthlyReportProjects extends Component {
  positionX = 0;

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
    const csv = new CreateCSV;
    const reports = this.props.reports.allTime;
    csv.mainTitle(reports.days)
    _.forEach(reports.byProject, (project, key) => {
      csv.rowTitle(project.name);
      project.users.forEach(user => {
        csv.rowTimeUser(reports.byUsers[user], key)
      });
    });
    csv.saveCSV();
  }

  exportCSVSingle = key => {
    const csv = new CreateCSV;
    const reports = this.props.reports.allTime;
    const project = reports.byProject[key]
    csv.mainTitle(reports.days);
    csv.rowTitle(project.name);
    project.users.forEach(user => {
      csv.rowTimeUser(reports.byUsers[user], key)
    });
    csv.saveCSV();
  }

  render() {
    const { t } = this.props;
    const reports = this.props.reports.allTime;

    return (
      <div>
        { _.isEmpty(reports.byUsers) ?
          <ClearPagePlaceholder>
            <p>{t("You don't have any data for today.")}</p>
          </ClearPagePlaceholder> :
          <div>
            <h2 className='report-header'>
              <span className='report-sub-header'>{t('Projects Reports Table')}</span>
              <button className='export-csv' onClick={this.exportCSVTotal}>
                <i className='icon-report' /> {t('Export CSV')}
              </button>
            </h2>
            {_.map(reports.byProject, (project, key) => (
              <MonthlyReportProject projectKey={key} key={key} reports={reports} />
						))}
          </div>}
      </div>
    );
  }
}

export default connect(mapStateToProps)(translate(['Dashboard'])(MonthlyReportProjects));

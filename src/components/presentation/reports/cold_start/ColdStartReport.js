import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import { translate } from 'react-i18next';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';

import { formatSecondsToHours } from '../../../../helpers/formatSecondsToHours';
import { trackerColors } from '../../../../helpers/colorTrackers';
import TitlesBlock from './TitlesBlock';
import ColdStartLineChart from './lineChart';
import ColdStartTimeLine from './TimeLine';
import ScreenshotsList from './Screenshots';
import ClearPagePlaceholder from '../../clearPagePlaceholder';
import ColdStartFilters from './ColdStartFilters';
import { createColdStartReport } from '../../../../actions/coldStart';

const mapStateToProps = ({ authorized: { user }, productivity, AppMonitoring }) => ({
  currentUser: user,
  productivity,
  AppMonitoring,
});

const actions = {
  createColdStartReport,
};

class ColdStartReport extends PureComponent {

  state = {
    reportingProcessOff: true,
    reportedPlanings: [],
    selectedDate: new Date(),
    titleInfo: {
      tracked_time: '00:00',
      reported_time: '00:00',
      not_reported_time: '00:00',
      persentsForTypes: [],
      productivitiesTypes: [],
    },
  };

    /**
     * @param {Int} hour
     */
  moveBlock = hour => {
    const node = document.getElementById('cold-start-block');
    if (node) {
            // In one column 150 px width
      node.scrollLeft = hour * 150;
    }
  };

    /**
     * @param {Array} reportedPlanings
     */
  getDataToServer = reportedPlanings => {
    this.setState({ reportedPlanings });
  };

    // Toggle reportingProcessOff to start filter component and to drop down charts info // TODO
  sendDataToServer = () => {
    this.setState({ reportingProcessOff: false }, () => {
      this.props.createColdStartReport([...this.state.reportedPlanings], () => {
        this.setState({ reportedPlanings: [], reportingProcessOff: true });
      });
    });
  };

    // The same problem as before // TODO
  rejectReports = () => {
    this.setState({ reportingProcessOff: false }, () => {
      this.setState({ reportedPlanings: [], reportingProcessOff: true });
    });
  };

    /**
     * @param {Date} selectedDate
     */
  setReportDay = selectedDate => {
    this.setState({
      selectedDate,
      reportedPlanings: [],
    });
  };

  changeTitleInfo = data => {
        // const titleInfo = Object.assign({}, this.state.titleInfo, data);
        // console.log(titleInfo);
        // REACT BUG //TODO RESEARCH
    this.setState({
            // titleInfo
      titleInfo: Object.assign(this.state.titleInfo, data),
    });
  };

  render() {
        // console.clear();
    const {
            t,
            currentUser,
            productivity,
            projectName,
            currentProject,
            AppMonitoring,
        } = this.props;

    const {
            reportedPlanings,
            reportingProcessOff,
            selectedDate,
            titleInfo,
        } = this.state;

    const activateSendBtn = reportedPlanings.some(s => 'form_data' in s);
    return (
      <div>
        <div className='widget'>
          <section className='cold-start-header'>
            <ColdStartFilters
              reportingProcessOff={reportingProcessOff}
              dateFilter={'SINGLE'}
              singleUser={currentUser.UserID}
              handleDayChange={this.setReportDay}
            />
            {
                            activateSendBtn &&
                            <div className='cold-report-btn-block'>
                              <button
                                onClick={this.rejectReports}
                                className='reject-cold-report-btn'
                              >
                                <span>Close without saving</span>
                              </button>
                              <button
                                onClick={this.sendDataToServer}

                                className='confirm-cold-report-btn'
                              >
                                <i className='icon-report' />
                                <span>Save Report</span>
                              </button>
                            </div>
                        }
          </section>
          <section>
            {
                            reportingProcessOff ?

                              <section className='cold-start-report-block'>

                                <TitlesBlock {...titleInfo} />
                                <Scrollbars
                                  className='cold-start-scroll'
                                  style={{ width: 'auto' }}
                                  autoHeight
                                  autoHeightMin={300}
                                        // Have to find out why autoHeight doesn`t work // TODO
                                  autoHeightMax={10000000000}
                                  renderView={props => <div {...props} className='content' id='cold-start-block' />}
                                  renderTrackHorizontal={props => <div {...props} className='track-horizontal' />}
                                  renderThumbHorizontal={props => <div {...props} className='thumb-horizontal' />}
                                >
                                  <ColdStartLineChart
                                    selectedDate={selectedDate}
                                    handleMoveBlock={this.moveBlock}
                                    handleChangeTitleInfo={this.changeTitleInfo}
                                    appMonitoring={AppMonitoring}
                                  />
                                  <ColdStartTimeLine
                                    selectedDate={selectedDate}
                                    handleChangeTitleInfo={this.changeTitleInfo}
                                    handleGetDataToServer={this.getDataToServer}
                                  />
                                  <ScreenshotsList />
                                </Scrollbars>
                              </section>
                            :
                              <ClearPagePlaceholder>
                                <p>{t('Wait please ')}</p>
                              </ClearPagePlaceholder>
                    }
          </section>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(translate(['Dashboard'])(ColdStartReport));

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { translate, Interpolate } from 'react-i18next';
import Portal from 'react-portal';

import TimeLine from './timeLine';
import './timeLine.scss';
import { test_data, allData } from './test_data';
import TimesheetCard from '../Cards/TimesheetCard';
import PopUpForSegment from '../Cards/PopUpForSegment';

const mapStateToProps = ({ timesheetsAllData }) => ({ timesheetsAllData });

export class ColdStartTimeLine extends PureComponent {

  constructor() {
    super();
    this.chart = null;
    this.state = {
      modalData: {
        open: false,
        timesheet: { from: new Date(), to: new Date() },
        x_axis: null,
      },
      popUpData: null,
      selected_segments: [],
    };
  }

  componentDidMount() {
    this.chart = new TimeLine({
      chartId: '#report-time-line',
    });
    this.chart.handleSetDataForModal(this.setDataForModal);
    this.chart.receiveHandleViewSegmentInfoMethod(this.viewSegmentInfo);
    this.drawChart({ ...this.props.timesheetsAllData });
  }

  componentWillReceiveProps(nextProps) {
    this.drawChart({ ...nextProps.timesheetsAllData });
  }

  componentWillUnmount() {
    this.chart.unmount();
  }

  /**
   *  @param {Object} data
   */
  drawChart = data => {
    const timeLineProductivities = this.fillTimeLine(data);
    this.getProductivitiesTypes(timeLineProductivities);
    this.chart.draw(timeLineProductivities);
  };

  cleanState = () => {
    this.setState({
      modalData: {
        open: false,
        timesheet: { from: new Date(), to: new Date() },
        x_axis: null,
      },
      selected_segments: [],
    });
  };

  confirmSelectingSegments = () => {
    const reported_segmants = this.state.selected_segments.filter(s => 'form_data' in s);
    this.props.handleGetDataToServer(reported_segmants);
  };

  viewSegmentInfo = (data, event) => {
    if (!data) {
      this.setState({ popUpData: null });
      return;
    }

    if ('form_data' in data) {
      this.setState({
        popUpData: {
          segment: data,
          planning: {
            ProjectID: data.form_data.projectData.ProjectID,
            CreatedAt: moment(data.from, 'x'),
            ClosedAt: moment(data.to, 'x'),
            IssueTitle: data.form_data.selectedIssue.Title,
          },
          x_axis: _.get(event, 'pageX', 0),
          y_axis: _.get(event, 'pageY', 0),
        },
      });
    } else {
      const {
        Plannings,
        SpentTime,
      } = this.props.timesheetsAllData;

      const segment = SpentTime.find(s => parseInt(`${s.StartedAt}000`) === data.from);
      if (!this.state.popUpData || segment === this.state.popUpData.segment) {
        const planning = Plannings.find(p => p.ID === segment.PlanningID);
        this.setState({
          popUpData: {
            segment,
            planning,
            x_axis: _.get(event, 'pageX', 0),
            y_axis: _.get(event, 'pageY', 0),
          },
        });
      }
    }
  };

  // Too long function , have to be optimized /TODO
  /**
   *  @param {Object} form_data
   */
  submitForm = form_data => {
    const timeLineProductivities_original = this.fillTimeLine({ ...this.props.timesheetsAllData });
    const timeLineProductivitiesCurrent = this.state.selected_segments.length ? [...this.state.selected_segments] : timeLineProductivities_original;

    /* Build new timesegments */
    const selected_segments = timeLineProductivitiesCurrent.reduce((result, segment) => {
      const segment_start_on_form = moment(segment.from).isBetween(form_data.timeFrom, form_data.timeTo);
      const segment_end_on_form = moment(segment.to).isBetween(form_data.timeFrom, form_data.timeTo);

      const form_inside_segment = moment(form_data.timeFrom).isBetween(segment.from, segment.to)
        && moment(form_data.timeTo).isBetween(segment.from, segment.to);

      const form_is_segment = moment(form_data.timeFrom).isSame(segment.from)
        && moment(form_data.timeTo).isSame(segment.to);

      if (segment_start_on_form && segment_end_on_form) {
        if (segment.key === 'cold-start') {
          result.push(Object.assign({}, segment, {
            form_data,
            key: 'online',
          }));
          return result;
        } else if (segment.key === 'unknown' && form_data.applyManualReporting) {
          result.push(Object.assign({}, segment, {
            form_data,
            key: 'manual',
          }));
          return result;
        } else {
          result.push(segment);
          return result;
        }
      } else if (segment_start_on_form) {
        if (segment.key === 'cold-start') {
          const newSegment = {
            form_data,
            key: 'online',
            from: segment.from,
            to: moment(form_data.timeTo).toDate().getTime(),
          };
          result.push(newSegment);
          const oldSegment = Object.assign({}, segment, {
            from: moment(form_data.timeTo).toDate().getTime(),
          });
          result.push(oldSegment);
          return result;
        } else if (segment.key === 'unknown' && form_data.applyManualReporting) {
          const newSegment = {
            form_data,
            key: 'manual',
            from: segment.from,
            to: moment(form_data.timeTo).toDate().getTime(),
          };
          result.push(newSegment);
          const oldSegment = Object.assign({}, segment, {
            from: moment(form_data.timeTo).toDate().getTime(),
          });
          result.push(oldSegment);
          return result;
        } else {
          result.push(segment);
          return result;
        }
      } else if (segment_end_on_form) {
        if (segment.key === 'cold-start') {
          const newSegment = {
            form_data,
            key: 'online',
            from: moment(form_data.timeFrom).toDate().getTime(),
            to: segment.to,
          };
          result.push(newSegment);

          const oldSegment = Object.assign({}, segment, {
            to: moment(form_data.timeFrom).toDate().getTime(),
          });
          result.push(oldSegment);

          return result;
        } else if (segment.key === 'unknown' && form_data.applyManualReporting) {
          const newSegment = {
            form_data,
            key: 'manual',
            from: moment(form_data.timeFrom).toDate().getTime(),
            to: segment.to,
          };
          result.push(newSegment);

          const oldSegment = Object.assign({}, segment, {
            to: moment(form_data.timeFrom).toDate().getTime(),
          });
          result.push(oldSegment);

          return result;
        } else {
          result.push(segment);
          return result;
        }
      } else if (form_inside_segment) {
        if (segment.key === 'cold-start') {
          const oldPrevSegment = Object.assign({}, segment, {
            to: moment(form_data.timeFrom).toDate().getTime(),
          });
          result.push(oldPrevSegment);

          const newSegment = {
            form_data,
            key: 'online',
            from: moment(form_data.timeFrom).toDate().getTime(),
            to: moment(form_data.timeTo).toDate().getTime(),
          };
          result.push(newSegment);

          const oldNextSegment = Object.assign({}, segment, {
            from: moment(form_data.timeTo).toDate().getTime(),
          });
          result.push(oldNextSegment);
          return result;
        } else if (segment.key === 'unknown' && form_data.applyManualReporting) {
          const oldPrevSegment = Object.assign({}, segment, {
            to: moment(form_data.timeFrom).toDate().getTime(),
          });
          result.push(oldPrevSegment);

          const newSegment = {
            form_data,
            key: 'manual',
            from: moment(form_data.timeFrom).toDate().getTime(),
            to: moment(form_data.timeTo).toDate().getTime(),
          };
          result.push(newSegment);

          const oldNextSegment = Object.assign({}, segment, {
            from: moment(form_data.timeTo).toDate().getTime(),
          });
          result.push(oldNextSegment);
          return result;
        } else {
          result.push(segment);
          return result;
        }
      } else if (form_is_segment) {
        if (segment.key === 'cold-start') {
          const newSegment = {
            form_data,
            key: 'online',
            from: moment(form_data.timeFrom).toDate().getTime(),
            to: moment(form_data.timeTo).toDate().getTime(),
          };
          result.push(newSegment);
          return result;
        } else if (segment.key === 'unknown' && form_data.applyManualReporting) {
          const newSegment = {
            form_data,
            key: 'manual',
            from: moment(form_data.timeFrom).toDate().getTime(),
            to: moment(form_data.timeTo).toDate().getTime(),
          };
          result.push(newSegment);
          return result;
        } else {
          result.push(segment);
          return result;
        }
      } else {
        result.push(segment);
        return result;
      }
    }, []);

    this.setState({ selected_segments }, () => {
      this.chart.draw(selected_segments);
      this.confirmSelectingSegments();
      this.getProductivitiesTypes(selected_segments);
    });
  };

  /**
   *  @param {Object} SpentTime
   */
  fillTimeLine = ({ SpentTime = [] }) => {
    const day = this.props.selectedDate;

    if (SpentTime.length !== 0) {
      const time_segments = SpentTime.map((segment, index) => {
        const startTimeStamp = parseInt(`${segment.StartedAt}000`);
        const endTimeStamp = segment.EndedAt ?
          parseInt(`${segment.EndedAt}000`) : parseInt(`${segment.StartedAt + segment.Spent}000`);
        return (
        {
          key: segment.Status.toLowerCase(),
          from: new Date(moment(startTimeStamp).toDate()).getTime(),
          to: new Date(moment(endTimeStamp).toDate()).getTime(),
        }
        );
      });
      /* Fill empty segmants */
      const startOfADay = moment(day).startOf('date').toDate().getTime();
      let start = moment(day).startOf('date').toDate().getTime();
      const endOfADay = moment(day).endOf('date').toDate().getTime();

      const clear_time_segmants = [];

      time_segments
        .sort((a, b) => a.from - b.from)
        .forEach((s, i) => {
          if (startOfADay !== s.from) {
            clear_time_segmants.push({
              key: 'unknown',
              from: start,
              to: s.from,
            });
            start = s.to;
          }

          if (i === time_segments.length - 1 && start !== endOfADay) {
            clear_time_segmants.push({
              key: 'unknown',
              from: start,
              to: endOfADay,
            });
          }
        });
      return time_segments.concat(clear_time_segmants);
    }
    return [{
      key: 'unknown',
      from: moment(day).startOf('date').toDate().getTime(),
      to: moment(day).endOf('date').toDate().getTime(),
    }];
  };

  /**
   *  @param {Object} timerange
   * @param {Object} event
   */
  setDataForModal = (timerange, event) => {
    if (timerange) {
      const initial_x = _.get(event, 'sourceEvent.pageX', this.state.modalData.x_axis);
      const x_axis = (initial_x > window.innerWidth - 400)
        ? initial_x - (initial_x - window.innerWidth + 400) : (initial_x < 350) ?
          initial_x + (350 - initial_x) : initial_x;
      this.setState({
        modalData: {
          open: true,
          timesheet: { from: timerange.from, to: timerange.to },
          x_axis,
        },
      });
    } else {
      this.setState({
        modalData: {
          open: false,
          timesheet: { from: new Date(), to: new Date() },
          x_axis: null,
        },
      });
    }
  };

  cancelSelection = () => {
    this.setState({
      modalData: {
        open: false,
        timesheet: { from: new Date(), to: new Date() },
      },
    });
    this.chart.cancelSelection();
  };

  /**
   *  @param {Date} timeFrom
   *  @param {Date} timeTo
   */
  deleteReports = (timeFrom, timeTo) => {
    const timeLineProductivitiesCurrent = [...this.state.selected_segments];
    if (timeLineProductivitiesCurrent.length > 0) {
      const selected_segments = timeLineProductivitiesCurrent.map(segment => {
        if (!('form_data' in segment)) return segment;

        const segment_start_on_form = moment(segment.from).isBetween(timeFrom, timeTo);
        const segment_end_on_form = moment(segment.to).isBetween(timeFrom, timeTo);

        const form_inside_segment = moment(timeFrom).isBetween(segment.from, segment.to)
          && moment(timeTo).isBetween(segment.from, segment.to);

        const form_is_segment = moment(timeFrom).isSame(segment.from)
          && moment(timeTo).isSame(segment.to);

        if (segment_start_on_form || segment_end_on_form || form_inside_segment || form_is_segment) {
          if (segment.key === 'online') {
            delete segment.form_data;
            return Object.assign({}, segment, {
              key: 'cold-start',
            });
          } else if (segment.key === 'manual') {
            delete segment.form_data;
            return Object.assign({}, segment, {
              key: 'unknown',
            });
          }
        }
        return segment;
      });

      this.setState({ selected_segments }, () => {
        this.chart.draw(selected_segments);
        this.confirmSelectingSegments();
        this.getProductivitiesTypes(selected_segments);
      });
    }
  };

  /**
   *
   * @param {Object} timesheet
   */
  changeSelection = timesheet => {
    this.chart.changeSelection(timesheet);
  };

  /**
   *
   * @param {Array} productivities
   */
  getProductivitiesTypes = productivities => {
    const productivitiesTypes = _.uniq(productivities.filter(s => s.key !== 'unknown').map(s => s.key));
    this.props.handleChangeTitleInfo({ productivitiesTypes });
  };

  render() {
    const {
      modalData,
      selected_segments,
      popUpData,
    } = this.state;

    return (
      <section>
        <div id='report-time-line' />
        <Portal isOpened={modalData.open}>
          <div
            className='report-timesheets-card'
            style={{ left: `${modalData.x_axis}px` }}
          >
            <TimesheetCard
              handleSubmitForm={this.submitForm}
              handleHideCard={this.cancelSelection}
              handleChangeSelection={this.changeSelection}
              handleDeleteReports={this.deleteReports}
              {...modalData}
            />
          </div>
        </Portal>
        <Portal isOpened={!!popUpData}>
          <div>
            {(!!popUpData) &&
              <div
                className='report-timesheets-pop-up'
                style={{ left: `${popUpData.x_axis}px`, top: `${popUpData.y_axis}px` }}
              >
                <PopUpForSegment {...popUpData} />
              </div>
            }
          </div>
        </Portal>
      </section>
    );
  }
}

export default connect(mapStateToProps)(translate(['Dashboard'])(ColdStartTimeLine));

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { translate, Interpolate } from 'react-i18next';

import './chart.scss';
import ChangesChart from './chart';
import { timeHumanize } from '../../../../../helpers/transformData';
import { test_data } from './test_data';

const mapStateToProps = ({ productivity, timesheetsAllData }) => ({ productivity, timesheetsAllData });

export class ColdStartLineChart extends PureComponent {
  constructor() {
    super();
    this.chart = null;
  }

  componentDidMount() {
    this.chart = new ChangesChart({
      chartId: '#report-line-chart',
    });

    this.chart.receiveHandlePopUpContentMethod(this.getUsersProductivityDetails);

    const productivities = this.formatProductivity(this.props.productivity);
    const allDayLongProductivities = this.fillAllDayProductivities(_.uniq(productivities));
    this.findFirstHour(productivities);
    this.chart.draw(allDayLongProductivities);
    this.countSpendTime({ ...this.props.timesheetsAllData });
    this.buildWorkTypePercentages({ ...this.props.productivity });
  }

  componentWillReceiveProps(nextProps) {
    const productivities = this.formatProductivity(nextProps.productivity);
    const allDayLongProductivities = this.fillAllDayProductivities(_.uniq(productivities));
    this.findFirstHour(productivities);
    this.chart.draw(allDayLongProductivities);
    this.countSpendTime({ ...nextProps.timesheetsAllData });
    this.buildWorkTypePercentages({ ...nextProps.productivity });
  }

  componentWillUnmount() {
    this.chart.unmount();
  }

  /**
   * @param {Array} productivities
   */
  findFirstHour = productivities => {
    try {
      const workItem = productivities
      .find(el => el.key === 'WORK')
      .items
      .find(el => el.value !== 0);

      if (workItem && moment.isDate(workItem.date)) {
        const hour = workItem.date.getHours();
        this.props.handleMoveBlock(hour);
      }
    } catch (err) {
      this.props.handleMoveBlock(0);
    }
  };

  /**
   * @param {Object} productivity
   */
  formatProductivity(productivity) {
    const data = [];
    if (!_.isEmpty(productivity)) {
      if ('hours' in productivity) {
        /* Summary productivity for current day */
        const currentDate = moment().format('DD/MM/YYYY');
        formatHours(productivity.hours, currentDate);
      } else {
        /* Map days */
        _.map(productivity.days, (day, date) => {
          formatHours(day.hours, date);
        });
      }
      /* Sort all activities by date */
      for (let i = 0; i < data.length; i += 1) {
        // _.sortBy(data[i].items, v => v.date + '');
        data[i].items.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
    }
    return data;

    function formatHours(hours, date) {
      /* Map hours in day */
      _.map(hours, (hour, h) => {
        const spent = hour.Spent > hour.Duration ? hour.Spent : hour.Duration;
        /* Map activities in hour */
        _.map(hour.activities, activity => {
          let a = _.find(data, { key: activity.Name });
          /* Activity time */
          const time = moment(date, 'DD/MM/YYYY');
          time.set({ hour: h, minute: 0, second: 0, millisecond: 0 });
          if (!a) {
            data.push({
              key: activity.Name,
              items: [{
                value: (activity.Duration / spent) * 100,
                date: time.toDate(),
              }],
            });
          } else {
            a.items.push({
              value: (activity.Duration / spent) * 100,
              date: time.toDate(),
            });
          }
          /* If no activity in next hour - set next to zero */
          if (!(`${parseInt(h, 10) + 1}` in hours) || !_.find(hours[`${parseInt(h, 10) + 1}`].activities, { Name: activity.Name })) {
            a = _.find(data, { key: activity.Name });
            time.set({ hour: h, minute: 59, second: 0, millisecond: 0 });
            a.items.push({
              value: 0,
              date: time.toDate(),
            });
          }
          /* If no activity in prev hour - set prev to zero */
          if (!(`${parseInt(h, 10) - 1}` in hours) || !_.find(hours[`${parseInt(h, 10) - 1}`].activities, { Name: activity.Name })) {
            a = _.find(data, { key: activity.Name });
            time.set({ hour: h - 1, minute: 59, second: 0, millisecond: 0 });
            a.items.push({
              value: 0,
              date: time.toDate(),
            });
          }
        });
      });
    }
  }

  /**
   * @param {Array} productivities
   */
  fillAllDayProductivities = productivities => {
    const day = this.props.selectedDate;

    const hoursSegments = [];
    for (let h = -1; h <= 23; h++) {
      hoursSegments.push(h);
    }

    /* Make 24 Segment for every key type productivity */
    const allDayProductivities = productivities.map(typeKeyBlock => {
      const key = typeKeyBlock.key;
      const items = hoursSegments.map(hour => {
        const withValueItems = typeKeyBlock.items.filter(el => el.value !== 0);
        const valueForHour = withValueItems.find(el => moment(el.date).format('H') == hour);

        if (valueForHour) {
          const valueForHourResultCell = Object.assign({}, valueForHour, {
            date: new Date(valueForHour.date).getTime(),
          });
          return valueForHourResultCell;
        }

        if (hour === -1 || hour === 23) {
          return (
          {
            value: 0,
            date: new Date(day).setHours(hour),
          }
          );
        }

        return null;
      });
      return (
      {
        key,
        items,
      }
      );
    });

    const placeholder = [{
      key: 'NO_DATA',
      items: hoursSegments.map(hour => ({
        value: 0,
        date: new Date(day).setHours(hour),
      })),
    }];

    return allDayProductivities.concat(placeholder);
  };

  /**
   * @param {Int} timestamp
   * @param {String} key
   */
  getUsersProductivityDetails = ({ timestamp, key }) => {
    const viewActivities = this.props.appMonitoring.filter(activity => parseInt(`${activity.CreatedAt}000`) === timestamp);

    viewActivities.sort((a, b) => b.Percent - a.Percent);
    const topActivities = _.slice(viewActivities, 0, 4);

    if (topActivities.length !== 0) {
      const popUpContent = this.buildPopUpContent({ topActivities, timestamp }).replace(/,/g, ' ');
      this.chart.updatePopUpContent(popUpContent);

      // Hack to make progressbar work in native js
      setTimeout(() => {
        topActivities.map(activity => {
          const node = document.getElementById(`key-${Math.ceil(activity.Percent)}${_.camelCase(activity.Title)}`);
          if (node) {
            node.setAttribute('style', `width:${Math.ceil(activity.Percent)}%`);
          }
        });
      }, 100);
    }
  };

  /**
   * @param {Array} topActivities
   * @param {Int} timestamp
   */
  buildPopUpContent = ({ topActivities, timestamp }) => (
      `<div class="report-linechirt-popUp">
        <b>Most used app</b>
        <span class='popUp-time'>at ${moment(timestamp).format('HH:MM')}</span>
        ${
          topActivities.map(activity => (
              `<section>
                <div class='popUp-title'>
                  <div>
                    <span>${activity.Title}</span> 
                    <span class=${`type-${_.lowerCase(activity.ActivityName)}`}>${_.upperFirst(_.lowerCase(activity.ActivityName))}</span>
                  </div>
                  <div>
                    <span class="persents">${Math.round(activity.Percent)}%</span>
                  </div>
                </div>
                <div class=${`progress-bar-${_.lowerCase(activity.ActivityName)}`}>
                  <div id=${`key-${Math.ceil(activity.Percent)}${_.camelCase(activity.Title)}`}>
                  </div>
                </div>
              </section>`
            ))
        }
      </div>`
    );

  /**
   * @param {Array} Plannings
   */
  countSpendTime = ({ Plannings = [] }) => {
    const spendOnline = Plannings.reduce((sum, el) => sum += el.SpentOnline + el.SpentManual + el.SpentOffline, 0);
    const reported = Plannings.reduce((sum, el) => sum += el.Reported, 0);

    const tracked_time_duration = moment.duration(spendOnline, 'seconds');
    const reported_time_duration = moment.duration(reported, 'seconds');
    const not_reported_time_duration = moment.duration(spendOnline - reported, 'seconds');

    const tracked_time = timeHumanize(tracked_time_duration.hours(), tracked_time_duration.minutes());
    const reported_time = timeHumanize(reported_time_duration.hours(), reported_time_duration.minutes());
    const not_reported_time = timeHumanize(not_reported_time_duration.hours(), not_reported_time_duration.minutes());
    this.props.handleChangeTitleInfo({
      tracked_time,
      reported_time,
      not_reported_time,
    });
  };

  /**
   * @param {Array} activities
   */
  buildWorkTypePercentages = ({ activities = [] }) => {
    /* Count value for every work-type */
    const valueForTypes = _.map(activities, activity_type => ({
      key: activity_type.Name,
      value: activity_type.Duration,
    }));

    /* Find relation between % and value */
    const valueInPersent = valueForTypes.reduce((sum, item) => sum + item.value, 0) / 100;

    /* Count persents for every work-type */
    const persentsForTypes = valueForTypes.map(block => ({
      key: block.key,
      persents: Math.round(block.value / valueInPersent),
    }));

    this.props.handleChangeTitleInfo({ persentsForTypes });
  };

  render() {
    return (
      <div id='report-line-chart' />
    );
  }
}

export default connect(mapStateToProps)(translate(['Dashboard'])(ColdStartLineChart));

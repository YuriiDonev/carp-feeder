import React, { PureComponent } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { translate, Interpolate } from 'react-i18next';

const CATEGORIES_TYPES = ['Work', 'Communication', 'Learning', 'Entertainment', 'Other'];

const TITLES_FOR_TIMELINE = {
  manual: 'Reported manually',
  online: 'Active tracking',
  'cold-start': 'Passive tracking',
  offline: 'Offline',
};

class TitlesBlock extends PureComponent {

  viewReportedTime = () => {
    const {
            tracked_time,
            reported_time,
            not_reported_time,
            t,
        } = this.props;

    return (
      <section className='report-title-block' >
        <div>
          <img src='/admin/style/imgs/notification_status_icon/tracked_time_icon.svg' />
          <b>{tracked_time}</b>
          <span>
            {t('Tracked for today')}
          </span>
        </div>
        <div>
          <img src='/admin/style/imgs/notification_status_icon/time_reported.svg' />
          <b>{reported_time}</b>
          <span>
            {t('Reported for today')}
          </span>
        </div>
        <div>
          <img src='/admin/style/imgs/notification_status_icon/alert_icon.svg' />
          <b>{not_reported_time}</b>
          <span>
            {t('Not reported for today')}
          </span>
        </div>
      </section>
    );
  };

  viewWorkTypePercentages = () => {
    const {
            t,
            persentsForTypes,
        } = this.props;

    return (
      <ul className='report-legend-list' >
        {
                    CATEGORIES_TYPES.map(type => {
                      const existed_type = persentsForTypes.find(el => _.upperFirst(el.key.toLowerCase()) === type);
                      return (
                        <li className={type.toLowerCase()} key={type}>
                          <span>{t(type)} - <b>{_.get(existed_type, 'persents', 0)}%</b></span>
                        </li>
                      );
                    })
                }
      </ul>
    );
  };

  viewProductivitiesTypes = () => {
    const {
          productivitiesTypes,
        } = this.props;

    return (
      <ul className='report-legend-list-time-line'>
        {
                productivitiesTypes.map(type => (
                  <li key={`${type}_productivity`} className={type}>
                    {TITLES_FOR_TIMELINE[type]}
                  </li>
                    ))
            }
      </ul>
    );
  };

  render() {
    return (

      <section className='report-line-chart-title-layout'>
        {
                    this.viewReportedTime()
                }
        {
                    this.viewWorkTypePercentages()
                }
        {
                    this.viewProductivitiesTypes()
                }
      </section>

    );
  }
}

export default translate(['Dashboard'])(TitlesBlock);

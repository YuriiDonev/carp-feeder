import React, { Component } from 'react';
import moment from 'moment';
import { translate } from 'react-i18next';

import _ from 'lodash';

class RenderHeaders extends Component {
  clickHandler = e => {
    this.props.cb(
      e.target.dataset.sortingKey,
      e.target.dataset.direction,
      e.target.dataset.day,
      this.props.tableKey);
  }

  render() {
    return (
      <tr>
        {_.map(this.props.days, (day, key) => (
          <th key={key} className='weekly'>
            <div className='sort-holder' onClick={this.clickHandler}>
              <button className='up' data-sorting-key='timeTotalDay' data-direction='desc' data-day={key} />
              <button className='down' data-sorting-key='timeTotalDay' data-direction='asc' data-day={key} />
            </div>
            { moment(key).format('ddd, MMM Do') }
          </th>))}
      </tr>
    );
  }

}

export default translate(['Dashboard'])(RenderHeaders);

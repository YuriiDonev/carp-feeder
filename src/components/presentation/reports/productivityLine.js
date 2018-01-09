import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const ProductivityLine = ({ activity, duration }) => (
  <div className='productivity-line'>
    {!_.isEmpty(activity)
      ? _.map(_.sortBy(activity, 'Order'), (activityItem, key) => (
        <div
          key={activityItem.Name}
          className={`productivity-item ${activityItem.Name.toLowerCase()}`}
          data-attr={`${activityItem.Name.toLowerCase()} ${(activityItem.Duration / duration * 100).toFixed(2)}%`}
          style={{ width: `${activityItem.Duration / duration * 100}%` }}
        />
        ))
      : null}
  </div>
        );

ProductivityLine.propTypes = {
  activity: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  duration: PropTypes.number,
};

export default ProductivityLine;

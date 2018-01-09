import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { ActionUsersSetActive } from './../../../actions/usersSetActive';
import { reportsDataRound } from './../../../helpers/reports';
import { Link } from 'react-router';

const mapStateToProps = ({ userActive }) => ({
  userActive,
});

class TrRightComponent extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    if ((this.props.userActive.id != nextProps.userActive.id && (this.props.trKey == nextProps.userActive.id || this.props.trKey == this.props.userActive.id))
        || (this.props.trData !== nextProps.trData)
    ) {
      return true;
    } else {
      return false;
    }
  }

  showHover = event => {
    const id = event.currentTarget.dataset.tr;
    this.props.onSetActive(id);
  }

  hideHover = () => {
    this.props.onSetDisactive();
  }

  checkIsActive(key) {
    if (key == this.props.userActive.id) {
      return 'active';
    } else {
      return '';
    }
  }

  render() {
    return (
      <tr
        key={this.props.trKey}
        data-tr={this.props.trKey}
        className={'report-name-total hover-' + `${this.checkIsActive(this.props.trKey)}`}
        onMouseEnter={this.showHover}
        onMouseLeave={this.hideHover}
      >
        {_.map(this.props.trData.days, (day, i) => {
          const dayData = this.props.trProject !== undefined ? day[this.props.trProject] : day.all;
          const url = !_.isEmpty(this.props.trData) && `uid=${this.props.trData.userID}&date=${moment(i).unix()}`;
          return (<td key={this.props.tdKey + i}>
            { dayData
                ? <Link to={`/admin/reports/daily?${url}`}>
                  <span className='monthly-span'>{ reportsDataRound(dayData / 3600) }
                    {reportsDataRound(dayData / 3600) !== '0.00'
                      ? <span className={reportsDataRound((dayData / 3600) - 8) > 0 ? 'more' : 'less'}>{reportsDataRound((dayData / 3600) - 8)}</span>
                      : null}
                  </span>
                </Link>
                : ' - '}
          </td>);
        })}
      </tr>
    );
  }
}

const actions = {
  onSetActive: ActionUsersSetActive.onSetActive,
  onSetDisactive: ActionUsersSetActive.onSetDisactive,
};

export default connect(mapStateToProps, actions)(TrRightComponent);

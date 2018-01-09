import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { ActionUsersSetActive } from '../../../actions/usersSetActive';
import {
  setUserLink,
  changeUser,
  setProjectLink,
  changeProject,
} from '../../../actions/filters';
import ProductivityLine from './productivityLine';
import _ from 'lodash';

const mapStateToProps = ({ userActive, reports: { allTime: { byUsers } } }) => ({
  userActive,
  byUsers,
});

class TrLeftComponent extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      (this.props.userActive.id != nextProps.userActive.id && (this.props.trKey == nextProps.userActive.id || this.props.trKey == this.props.userActive.id))
      || !_.isEqual(this.props.trUser, nextProps.trUser)
      || !_.isEqual(this.props.trSpentTime, nextProps.trSpentTime)
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

  linkToTimesheetsUser = () => {
    this.props.setUserLink(true);
    this.props.changeUser(this.props.trUser.userID);
    browserHistory.push('/admin/teamStats/timesheets');
  }

  linkToTimesheetsProject = () => {
    const [tracker, project] = this.props.trTrackerProjectIDs.split('_');
    this.props.setProjectLink(true);
    this.props.changeProject({
      ProjectID: project,
      TrackerID: +tracker,
    });
    browserHistory.push('/admin/teamStats/timesheets');
  }

  checkMixedOrUserTable(trUser, trProject) {
    if (trUser && !trProject) {
      return (
        <div className='report-row' onClick={this.linkToTimesheetsUser}>
          <span className='user-name'>{ trUser.name }</span>
          <span className='add-info'>{ trUser.email }</span>
        </div>
      );
    } else if (trProject && trUser) {
      return (
        <div className='report-row' onClick={this.linkToTimesheetsProject}>
          {trProject}
        </div>
      );
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
        <td>
          <div className='row'>
            <div className='report-td-name'>
              {this.checkMixedOrUserTable(this.props.trUser, this.props.trProject)}
            </div>
            <div className='report-table-tHead'>
              <span className='span-with-small-clock'><i className='icon-clock' /></span>
              <span className='opposite-username'>{this.props.trSpentTime}<span className='span-by-month'>{this.props.monthly ? 'by month' : 'by week'}</span></span>
            </div>
          </div>
          { !this.props.trProject && <div className='row'>
              {
                !_.isEmpty(this.props.trUser.Activities) &&
                <ProductivityLine
                  activity={this.props.trUser.Activities.activities}
                  duration={this.props.trUser.Activities.total}
                />
              }
          </div>}
        </td>
      </tr>
    );
  }
}

const actions = {
  onSetActive: ActionUsersSetActive.onSetActive,
  onSetDisactive: ActionUsersSetActive.onSetDisactive,
  setUserLink,
  changeUser,
  setProjectLink,
  changeProject,
};

export default connect(mapStateToProps, actions)(TrLeftComponent);

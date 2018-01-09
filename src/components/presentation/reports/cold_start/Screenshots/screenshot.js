import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Confirm from 'react-confirm-bootstrap';
import moment from 'moment';
import _ from 'lodash';

import { deleteScreenshot } from '../../../../../actions/screenshots';
import { ROOT_ROUT } from '../../../../../actions/types';

const mapStateToProps = ({ projectsSettings, authorized, colleagues }) => ({
  projectsSettings,
  authorized,
  colleagues,
});

const actions = { deleteScreenshot };

class Screenshot extends Component {
  static propTypes = {
    screenshot: PropTypes.object.isRequired,
    screenshotIndex: PropTypes.number.isRequired,
    onOpenLightbox: PropTypes.func.isRequired,
    deleteScreenshot: PropTypes.func.isRequired,
  }

  get deletePermission() {
    /* If user admin on project */
    if (this.props.screenshot.IsAdmin) {
      return true;
    }
    /* If user screenshot owner */
    const currentUserID = this.props.authorized.user.UserID;
    if (this.props.screenshot.UserID === currentUserID) {
      const settings = _.result(
        _.find(this.props.projectsSettings, { ProjectID: this.props.screenshot.ProjectID, TrackerID: this.props.screenshot.TrackerID }),
        'settings',
      );

      if (settings) {
        const userSettingsDelete = settings[`screenshot-del-user-${currentUserID}`];
        if (userSettingsDelete === 'on') {
          return true;
        }
        const defaultSettingsDelete = settings['screenshot-del'];
        if (defaultSettingsDelete === 'on' && userSettingsDelete !== 'off') {
          return true;
        }
      }
    }
    return false;
  }

  handleOpen = () => {
    this.props.onOpenLightbox(this.props.screenshotIndex);
  }

  getTimeRange() {
    return moment.unix(this.props.screenshot.CreatedAt).format('HH:mm:ss');
  }
  handleConfirm = () => {
    this.props.deleteScreenshot(this.props.screenshot);
  }

  render() {
    const { screenshot } = this.props;
    return (
      <div className='cold-start-screenshot'>
        <a style={{ cursor: 'pointer' }} onClick={this.handleOpen}>
          <img
            ref={img => this.img = img}
            alt='Screenshot not available'
            src={`${ROOT_ROUT}/screenshot/screenshots?id=${screenshot.ID}`}
            onError={() => { this.img.src = '/admin/style/imgs/broken-file.svg'; }}
          />
        </a>
        <span className='screenshot-meta'>{this.getTimeRange()}</span>
        {
              this.deletePermission ? (
                <Confirm
                  style={{ marginTop: '10px' }}
                  onConfirm={this.handleConfirm}
                  body='Are you sure you want to delete screenshot?'
                  confirmText='Delete'
                  title='Delete Screenshot'
                >
                  <i className='icon-remove screenshot-remove' />
                </Confirm>
              ) : null
            }
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(Screenshot);

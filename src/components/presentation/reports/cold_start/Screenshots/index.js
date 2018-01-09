import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import Lightbox from 'react-image-lightbox';
import InfiniteScroll from 'react-infinite-scroller';
import Portal from 'react-portal';

import { ROOT_ROUT } from '../../../../../actions/types';
import Screenshot from './screenshot';

const mstp = ({ screenshots }) => ({
  screenshots,
});

const allRanges = {};
for (let h = 0; h < 24; h++) {
  allRanges[h] = [];
}


class ScreenshotsList extends PureComponent {

  static propTypes = {
    screenshots: PropTypes.array.isRequired,
  }

  state = {
    lightboxOpen: false,
    lightboxIndex: 0,
    hasMore: true,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.screenshots != this.props.screenshots) {
      this.setState({
        hasMore: true,
      });
    }
  }

  /**
   * @param {Int} index
   */
  handleOpenLightbox = index => {
    this.setState({
      lightboxOpen: true,
      lightboxIndex: index,
    });
  };

  handleCloseLightbox = () => {
    this.setState({ lightboxOpen: false });
  };

  handlePrevImage = () => {
    this.setState({
      lightboxIndex: ((this.state.lightboxIndex + this.props.screenshots.length) - 1) % this.props.screenshots.length,
    });
  };

  handleNextImage = () => {
    this.setState({
      lightboxIndex: (this.state.lightboxIndex + 1) % this.props.screenshots.length,
    });
  };

  /**
   * @param {Array} screenshots
   */
  processRanges = screenshots => {
    const existedRanges = _.groupBy(screenshots, s => (moment.unix(s.CreatedAt).format('HH')));
    const ranges = Object.assign({}, allRanges, existedRanges);
    return ranges;
  };

  renderLightbox() {
    if (this.state.lightboxOpen) {
      const { screenshots } = this.props;
      const mainSrc = screenshots[this.state.lightboxIndex].ID;
      const nextSrc = screenshots[(this.state.lightboxIndex + 1) % screenshots.length].ID;
      const prevSrc = screenshots[((this.state.lightboxIndex + screenshots.length) - 1) % screenshots.length].ID;
      return (
        <Lightbox
          mainSrc={`${ROOT_ROUT}/screenshot/screenshots?id=${mainSrc}`}
          nextSrc={`${ROOT_ROUT}/screenshot/screenshots?id=${nextSrc}`}
          prevSrc={`${ROOT_ROUT}/screenshot/screenshots?id=${prevSrc}`}
          onCloseRequest={this.handleCloseLightbox}
          onMovePrevRequest={this.handlePrevImage}
          onMoveNextRequest={this.handleNextImage}
        />
      );
    }
    return null;
  }

  getScreenshotsToShow = () => {
    const ranges = this.processRanges(this.props.screenshots);
    return _.map(ranges, (screenshots, hour) => {
      let filtredScreenshots = [];
      const sLengthQ = screenshots.length / 4;

      if (sLengthQ <= 1) {
        filtredScreenshots = screenshots;
      } else {
        for (let i = 0; i < 4; i++) {
          filtredScreenshots.push(screenshots[Math.floor(sLengthQ * i)]);
        }
      }
      return (
        <div key={hour} className='column'>
          {
                filtredScreenshots.map(screenshot => (
                  <Screenshot
                    key={screenshot.ID}
                    screenshotIndex={_.findIndex(this.props.screenshots, { ID: screenshot.ID })}
                    screenshot={screenshot}
                    onOpenLightbox={this.handleOpenLightbox}
                  />
                ))
              }
        </div>
      );
    }).sort((a, b) => a.key - b.key);
  };

  render() {
    const {
      screenshots,
    } = this.props;
    const ranges = this.processRanges(this.props.screenshots);
    return (
      <section style={{ minHeight: '300px' }}>
        {
          screenshots.length > 0 ?
            <div className='reports-screenshots-content'>
              {
                this.getScreenshotsToShow()
              }
            </div>
            :
            <Portal isOpened>
              <div className='reports-screenshots-disabled'>
                <div className='clear-page-img-placeholder'>
                  <img src='/admin/style/imgs/screenshoting.svg' />
                </div>
                <span>Screenshooting disabled</span>
              </div>
            </Portal>
        }
        {
          this.renderLightbox()
        }
      </section>
    );
  }
}

export default connect(mstp)(ScreenshotsList);

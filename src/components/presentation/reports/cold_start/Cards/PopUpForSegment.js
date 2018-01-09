import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { translate, Interpolate } from 'react-i18next';

const mapStateToProps = ({ projects }) => ({
  projects,
});

class PopUpForSegment extends PureComponent {

  render() {
    const {
            projects,
            planning,
        } = this.props;

    const project = projects.find(p => p.ProjectID === planning.ProjectID);
    const start = moment(planning.CreatedAt, 'X');
    const end = moment(planning.ClosedAt ?
            planning.ClosedAt : planning.CreatedAt + planning.Reported, 'X');
    const duration = moment(end.diff(start)).format('HH : mm');
    return (
      <main>
        <h5>Project : {_.truncate(_.get(project, 'Name', ''), { length: 20 })}</h5>
        <h5>Issue : { _.truncate(planning.IssueTitle, { length: 20 }) }</h5>
        <h5>Start : {start.format('LLL')}</h5>
        <h5>End : {end.format('LLL')}</h5>
        <h5>Spent : {duration}</h5>
      </main>
    );
  }
}

export default connect(mapStateToProps)(translate(['Dashboard'])(PopUpForSegment));

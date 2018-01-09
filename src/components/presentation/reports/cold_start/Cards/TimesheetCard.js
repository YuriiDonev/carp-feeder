import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { translate } from 'react-i18next';
import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';

import SelectTaskWithChips from '../../../common/selectWithChips/SelectTaskWithChips';
import { addTimesheet } from '../../../../../actions/timesheets';
import { fetchProjectIssues, resetProjIssues } from '../../../../../actions/tracker/project';
import { showMessages } from '../../../../../actions/messages';
import { getSettings } from '../../../../../actions/settings';

const actions = {
  showMessages,
  addTimesheet,
  fetchProjectIssues,
  resetProjIssues,
  getSettings,
};

const mapStateToProps = ({ projectIssues, projects, filters, timeRange, commonSettings }) => ({
  projects,
  filters,
  issues: projectIssues,
  timeRange,
  commonSettings,
});

class TimesheetCard extends PureComponent {

  state = {
    projectId: null,
    activityTypes: [],
    activityId: null,
    issues: [],
    selectedIssue: null,
    timeFrom: null,
    timeTo: null,
    comment: '',
    applyManualReporting: true,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.filters.date !== this.props.filters.date) {
      this.close();
    }


    if (nextProps.timesheet &&
      nextProps.filters &&
      nextProps.filters !== this.props.filters &&
      _.isObject(nextProps.filters.projects[0])) {
      const projectData = nextProps.filters.projects[0];
      const activityTypes = _.find(this.props.projects, { ProjectID: projectData.ProjectID, TrackerID: projectData.TrackerID }).ActivityTypes;
      const projectId = JSON.stringify(nextProps.filters.projects[0]);
      this.setState({
        projectId,
        activityTypes: activityTypes || [],
      });
      this.props.fetchProjectIssues(projectData.ProjectID, projectData.TrackerID);
      this.props.getSettings(projectData.ProjectID, projectData.TrackerID, []);
    }


    if (nextProps.issues && nextProps.issues.length > 0) {
      this.setState({ issues: nextProps.issues });
    }

    if (nextProps.timesheet) {
      this.setState({
        timeFrom: nextProps.timesheet.from,
        timeTo: nextProps.timesheet.to,
      });
    }
  }

  close = () => {
    this.setState({
      projectId: null,
      activityTypes: [],
      activityId: null,
      issues: [],
      selectedIssue: null,
      timeFrom: null,
      timeTo: null,
      comment: '',
      applyManualReporting: true,
    });
    this.props.resetProjIssues();
    this.props.handleHideCard();
  };

  delete = () => {
    const {
            timeFrom,
            timeTo,
        } = this.state;
    this.props.handleDeleteReports(
            timeFrom,
            timeTo,
    );
    this.close();
  };

  submit = e => {
    e.preventDefault();

    const {
            projectId,
            selectedIssue,
            activityId,
            timeFrom,
            timeTo,
            comment,
            applyManualReporting,
        } = this.state;

    if (projectId && selectedIssue && comment) {
      this.props.handleSubmitForm({
        projectData: JSON.parse(projectId),
        selectedIssue,
        activityId,
        timeFrom,
        timeTo,
        comment: _.trim(comment),
        applyManualReporting,
      });
      this.close();
    }
  };

  /**
   *
   * @param {String} projectId
   */
  changeProject = projectId => {
    if (projectId === null) {
      this.props.resetProjIssues();
      this.setState({
        projectId,
        activityTypes: [],
        activityId: null,
        issues: [],
        selectedIssue: null,
      });
    } else {
      const projectData = JSON.parse(projectId);

      if (projectData) {
        const activityTypes = _.find(this.props.projects, { ProjectID: projectData.ProjectID, TrackerID: projectData.TrackerID }).ActivityTypes;
        this.setState({
          projectId,
          activityTypes: activityTypes || [],
          issues: [],
        }, () => {
          this.props.resetProjIssues();
          this.props.fetchProjectIssues(projectData.ProjectID, projectData.TrackerID);
          this.props.getSettings(projectData.ProjectID, projectData.TrackerID, []);
        });
      }
    }
  };

  /**
   *
   * @param {Int} task_id
   */
  changeTask = task_id => {
    if (task_id === null) {
      this.setState({
        activityTypes: [],
        activityId: null,
        selectedIssue: null,
      });
    } else {
      const selectedIssue = this.state.issues.find(t => t.ID === task_id);
      this.setState({
        selectedIssue,
      });
    }
  };

  /**
   *
   * @param {Int} activityId
   */
  changeActivity = activityId => {
    if (activityId === null) {
      this.setState({
        activityId,
      });
    } else {
      this.setState({
        activityId,
      });
    }
  };

  toggleManualReportPermission = () => {
    this.setState({ applyManualReporting: !this.state.applyManualReporting });
  };

  /**
   * @param {String} type
   * @param {Moment} time
   */
  handleChangeTime = (type, time) => {
    const {
            timeFrom,
      timeTo,
        } = this.state;

    if (type === 'from') {
      if (time < timeTo) {
        this.setState({ timeFrom: moment(time).toDate() }, () => {
          this.props.handleChangeSelection({ from: time, to: timeTo });
        });
      }
      if (!moment(time).isValid()) {
        this.setState({ timeFrom: timeTo - 1 }, () => {
          this.props.handleChangeSelection({ from: timeTo - 1, to: timeTo });
        });
      }
    } else {
      if (time > timeFrom) {
        this.setState({ timeTo: moment(time).toDate() }, () => {
          this.props.handleChangeSelection({ from: timeFrom, to: time });
        });
      }
      if (!moment(time).isValid()) {
        this.setState({ timeTo: timeFrom + 1 }, () => {
          this.props.handleChangeSelection({ from: timeFrom, to: timeFrom + 1 });
        });
      }
    }
  };

  /**
   * @param {Event} e
   */
  handleChangeComment = e => {
    const comment = e.target.value;
    this.setState({ comment });
  };

  render() {
    const {
            timesheet: propsTimesheet,
            t,
            issues: propsIssues,
            projects: propsProjects,
        } = this.props;

    const {
            projectId,
            activityTypes,
            issues,
            selectedIssue,
            timeFrom,
            timeTo,
            applyManualReporting,
            comment,
        } = this.state;

    if (!propsTimesheet) return (<div />);

    const disabledSubmit = !(projectId && selectedIssue && comment);

    return (
      <form onSubmit={this.submit}>
        <main>
          <div className='timesheet-add-manually'>
            <div>
              <SelectTaskWithChips
                projects={propsProjects}
                issues={issues}
                activityTypes={activityTypes}

                handlerChangeProject={this.changeProject}
                handlerChangeTask={this.changeTask}
                handlerChangeActivity={this.changeActivity}
              />
              <div className='card-time-picker-block'>
                <label>Worked hours</label>
                <div>
                  <TimePicker
                    style={{ width: 100 }}
                    showSecond={false}
                    value={moment(timeFrom)}
                    className='time-block-from'
                    allowEmpty={false}
                    onChange={this.handleChangeTime.bind(this, 'from')}
                  />
                  <TimePicker
                    style={{ width: 100 }}
                    showSecond={false}
                    value={moment(timeTo)}
                    className='time-block-to'
                    allowEmpty={false}
                    onChange={this.handleChangeTime.bind(this, 'to')}
                  />
                </div>
              </div>
            </div>

            <div className='row'>
              <div className='area-holder'>
                <div className='area-holder-title'>
                  <label>Comment</label>
                  <label>{comment.length}/250</label>
                </div>
                <textarea
                  value={comment}
                  maxLength='250'
                  className='form-control modal-body-textarea'
                  placeholder='Write a comment'
                  onChange={this.handleChangeComment}
                />
              </div>
            </div>
            <div className='row'>
              <input
                type='checkbox'
                checked={applyManualReporting}
                onChange={this.toggleManualReportPermission}
              />
              <span>{t('Allow manual reporting')}</span>
            </div>
          </div>
        </main>
        <footer>
          <section>
            <button type='submit' className='submit-btn' disabled={disabledSubmit}>
              <span>Submit</span>
            </button>
            <b>or</b>
            <button type='button' onClick={this.close} className='cancel-btn'>
              <span>Cancel</span>
            </button>
          </section>
          <button type='button' onClick={this.delete} className='delete-btn'>
            <i className='icon-remove' />
            <span>Delete</span>
          </button>
        </footer>
      </form>
    );
  }
}

export default connect(mapStateToProps, actions)(translate(['Dashboard'])(TimesheetCard));

import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { translate } from 'react-i18next';

import DefaultFilters from '../../common/filters/index';
import { fetchProductivity, clearProductivity } from '../../../../actions/productivity';
import { fetchScreenshots, removeScreenshots } from '../../../../actions/screenshots';
import { ApplicationFetchUsers } from '../../../../actions/ApplicationMonitoring';
import { filterProjects } from '../../../../actions/projects';
import { filterUsers } from '../../../../actions/users';
import { fetchTimesheets } from '../../../../actions/timesheets';
import {
  changeDate,
  changeUser,
  changeUsers,
  changeProjects,
  changeTags,
  changeProductivityType,
  initFilters,
  rangeFilterChange,
  changeDateRange,
} from '../../../../actions/filters';


const mstp = ({
  filters,
  filterUsers,
  filterProjects,
  filterTags,
  projects,
  users,
  projectTags,
  tracker: { trackers },
}) => ({
  filters,
  users: filterUsers,
  projects: _.get(filterProjects, 'projects', filterProjects),
  tags: filterTags,
  projectCollection: projects,
  userCollection: users,
  tagCollection: projectTags,
  hasTrackers: !!(trackers && trackers.length),
});

const actions = {
  changeDate,
  changeUsers,
  changeUser,
  changeProjects,
  changeTags,
  changeProductivityType,
  fetchProductivity,
  clearProductivity,
  initFilters,
  filterProjects,
  filterUsers,
  rangeFilterChange,
  ApplicationFetchUsers,
  changeDateRange,
  fetchScreenshots,
  removeScreenshots,
  fetchTimesheets,
};

class ColdStartFilters extends DefaultFilters {

  componentDidMount() {
    const initFilters = {
      projects: [],
      userIds: this.props.singleUser ? [this.props.singleUser] : [],
      productivityType: 'COLD_START',
      date: moment(),
    };

    this.props.initFilters(initFilters);
  }

  componentWillReceiveProps(nextProps) {
    let userIds;
    let projectIds;

    if (nextProps.filters.productivityType === 'USER_PRODUCTIVITY') {
      userIds = [nextProps.singleUser];
    } else if (!_.isEmpty(nextProps.filters.userIds)) {
      userIds = nextProps.filters.userIds;
    } else {
      userIds = nextProps.userCollection.map(user => user.id);
    }

    if (_.isEmpty(nextProps.filters.projects)) {
      projectIds = nextProps.projectCollection.reduce((res, project) => {
        if (project.ProjectStatus !== 'ARCHIVED') {
          res.push({
            TrackerID: project.TrackerID,
            ProjectID: project.ProjectID,
          });
        }
        return res;
      }, []);
    } else {
      projectIds = nextProps.filters.projects;
    }

    if (
      (nextProps.hasTrackers && nextProps.filters !== this.props.filters)
      || this.props.reportingProcessOff !== nextProps.reportingProcessOff && nextProps.reportingProcessOff
    ) {
      this.props.handleDayChange(nextProps.filters.date);
      this.props.fetchProductivity({
        ...nextProps.filters,
        projects: projectIds,
        userIds,
      });
      this.props.ApplicationFetchUsers({
        ...nextProps.filters,
        projects: projectIds,
        userIds,
      });
      this.props.fetchScreenshots({
        ...nextProps.filters,
        projects: projectIds,
        userIds,
      }, nextProps.projectCollection);
      this.props.fetchTimesheets({
        ...nextProps.filters,
        projects: projectIds,
        userIds,
      }, projectIds);
    }
  }

  componentWillUnmount() {
    this.props.changeProductivityType(null);
    this.props.clearProductivity();
    this.props.removeScreenshots();
  }
}

export default connect(mstp, actions)(translate(['Dashboard'])(ColdStartFilters));

import { connect } from 'react-redux';
import moment from 'moment';
import { translate } from 'react-i18next';
import {
  changeUsers,
  changeProjects,
  changeTags,
  changeDate,
  changeDateRange,
  initFilters,
  setReportsType,
} from '../../../../actions/filters';
import { filterUsers } from '../../../../actions/users';
import { filterProjects } from '../../../../actions/projects';

import DefaultFilters from '../../common/filters/index';

import { fetchAllTime } from '../../../../actions/reports';

const mstp = ({
  filters,
  filterUsers,
  filterProjects,
  filterTags,
  projects,
  users,
  projectTags,
  authorized,
}) => ({
  filters,
  users: filterUsers,
  projects: filterProjects.projects,
  tags: filterTags,
  projectCollection: projects,
  userCollection: users,
  tagCollection: projectTags,
  authorized,
});

const actions = {
  filterUsers,
  filterProjects,
  changeUsers,
  changeProjects,
  changeTags,
  changeDate,
  changeDateRange,
  fetchAllTime,
  initFilters,
  setReportsType,
};


class Filters extends DefaultFilters {
  componentDidMount() {
    const initFilters = {
      fromDate: moment().startOf('month'),
      toDate: moment().endOf('month'),
      userIds: [],
      projects: [],
      reportsType: 'MIXED',
    };
    this.props.initFilters(initFilters);
  }

  componentWillReceiveProps(nextProps) {
    let userIds;
    let projectIds;

    if (!_.isEmpty(nextProps.filters.userIds)) {
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

    if (this.props.filters !== nextProps.filters && this.props.filters.reportsType === nextProps.filters.reportsType) {
      this.props.fetchAllTime({
        ...nextProps.filters,
        projects: projectIds,
        userIds,
      });
    }
  }
}

export default connect(mstp, actions)(translate(['Dashboard'])(Filters));

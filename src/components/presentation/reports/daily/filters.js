import { connect } from 'react-redux';
import moment from 'moment';
import parseQuery from '../../../../helpers/parseQuery';
import { translate } from 'react-i18next';
import {
  changeUsers,
  changeProjects,
  changeTags,
  changeDate,
  changeDateRange,
  initFilters,
} from '../../../../actions/filters';
import { filterUsers } from '../../../../actions/users';
import { filterProjects } from '../../../../actions/projects';
import DefaultFilters from '../../common/filters/index';
import { fetchTime } from '../../../../actions/reports';

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
  fetchTime,
  initFilters,
};


class Filters extends DefaultFilters {
  componentDidMount() {
    const query = parseQuery(window.location.href);

    const initFilters = {
      date: query.date ? moment.unix(parseInt(query.date, 10)) : moment(),
      userIds: query.uid ? [parseInt(query.uid, 10)] : [],
      projects: [],
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

    const filters = {
      ...nextProps.filters,
      projects: projectIds,
      userIds,
    };

    if (this.props.filters !== nextProps.filters) {
      this.props.fetchTime(filters, nextProps.projects, nextProps.users);
    }
  }
}

export default connect(mstp, actions)(translate(['Dashboard'])(Filters));

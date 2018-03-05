import { reducer as form } from 'redux-form';
import { reducer as messages } from 'react-notification-system-redux';

import authorized from './authorized';
import activity from './activity';
import screenshots from './screenshots';
import lastScreenshots from './lastScreenshots';
import loading from './loading';
import productivity from './productivity';
import notifications from './notifications';
import timesheets from './timesheets';
import commonSettings from './settings_common';
import plannings from './plannings';
import productivityHours from './productivityHours';
import filters from './filters';
import filterProjects from './filterProjects';
import filterUsers from './filterUsers';
import users from './users';
import userSettings from './userSettings';
import projects from './projects';
import project from './project';
import projectIssues from './projectIssues';
import AppMonitoring from './AppMonitoring';
import UrlMonitoring from './UrlMonitoring';
import reports from './reports';
import dashboard from './dashboard';
import violations from './violations';
import colleagues from './colleagues';
import productivitySettings from './productivity-settings';
import issues from './issues';
import timeline from './timeline';
import violationsProject from './violationsProject';
import dashboardProjects from './dashboardProjects';
import reportFilters from './reportFilters';
import popover from './popover';
import timeSheetModal from './timeSheetmodal';
import settingsAppsUrls from './settings_apps_urls';
import settingsIntegrations from './settings_integrations';
import profileReducer from './profile';
import issue_violations from './issue_violations'; // eslint-disable-line camelcase
import profileState from './profilestate';
import profileSnapshot from './profile_snapshot';
import tracker from './trackers';
import spinner from './spinner';
import noDataNotification from './no_data_notification';
import productivityActivities from './productivityActivities';
import timeRange from './timeRange';
import screenshotStorage from './settings_screenshot_storage';
import projectTags from './projectTags';
import filterTags from './filterTags';
import codeMetrics from './codeMetrics';
import codeMetricsIntegrations from './codeMetricsIntegrations';
import achievements from './achievements';
import sidebar from './sidebar';
import projectsSettings from './projectsSettings';
import planningWidget from './planningWidget';
import forgotPassword from './forgotPassword';
import getDownload from './getDownload';
import userActive from './setActive-reducer';
import temporaryUser from './temporaryUser';
import latestProjects from './latestProjects';
import filterRepository from './filterRepository';
import confirmEmail from './confirmEmail';
import teamPulse from './teamPulse';
import tutorial from './tutorial';
import timesheetsAllData from './timesheetsAllData';
import tooltip from './tooltip';

const rootReducer = {
  screenshotStorage,
  productivityActivities,
  commonSettings,
  noDataNotification,
  spinner,
  productivityHours,
  form,
  popover,
  timeSheetModal,
  filters,
  filterProjects,
  filterUsers,
  AppMonitoring,
  UrlMonitoring,
  dashboard,
  violations,
  colleagues,
  issues,
  timeline,
  violationsProject,
  dashboardProjects,
  reportFilters,
  reports,
  authorized,
  screenshots,
  lastScreenshots,
  loading,
  messages,
  productivity,
  activity,
  productivitySettings,
  notifications,
  timesheets,
  plannings,
  users,
  userSettings,
  projects,
  project,
  projectIssues,
  settingsAppsUrls,
  settingsIntegrations,
  profileReducer,
  issue_violations,
  profileState,
  profileSnapshot,
  tracker,
  timeRange,
  projectTags,
  filterTags,
  codeMetrics,
  codeMetricsIntegrations,
  achievements,
  sidebar,
  projectsSettings,
  planningWidget,
  forgotPassword,
  userActive,
  getDownload,
  temporaryUser,
  latestProjects,
  filterRepository,
  confirmEmail,
  teamPulse,
  tutorial,
  timesheetsAllData,
  tooltip,
};

export default rootReducer;

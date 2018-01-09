import { LOGIN,
    LOGOUT,
    PWD_RESET_SUCCESS,
    PWD_RESET_ERROR,
    SIGN_UP_SUCCESS,
    REFRESH_TOKEN,
    ROOT_ROUT,
    SIGN_UP_ERR,
    SIGN_UP_ERR_HIDE,
    PWD_CONFIRM_SUCCESS,
    LOGIN_ERROR,
    SPINNER_SET,
    SPINNER_UNSET,
    HIDE_SUCCESS_SIGNUP,
    SING_IN_ERROR,
    NOT_USER_EXISTED,
    FORGOT_PASSWORD_SENT,
    CLEAR_MESSAGE,
    SIGN_UP_LATER_ERR,
    SIGN_UP_LATER_ERR_HIDE,
    REGISTER_USER_DATA,
    SHOW_CHECK_MAIL,
    HIDE_CHECK_MAIL,
    START_DEANONYMIZE,
    HAS_REGISTRATION_SESSION,
    KILL_TEMPORARY_USER,
    FINDED_USER_INFO,
    FINDED_USER_INFO_ERROR,
    UNHIDE_USER_ERROR,
    TRACKER_BUTTON_ERROR,
    TUTORIAL_START,
} from './types';
import { browserHistory } from 'react-router';
import moment from 'moment';
import { showMessages } from './messages';
import Cookies from 'js-cookie';
import callApi from '../middlewares/jsonRpc';
import { splitName } from '../helpers/splitName';
import { fetchCurrentUser } from './users';

let refreshInterval;

export const doRefreshToken = (Expires, dispatch, token = 'RefreshToken') => {
  const refreshTokenTime = (Expires - moment().unix() - 60) * 1000;

  if (refreshInterval) clearInterval(refreshInterval);

  refreshInterval = setInterval(() => {
    dispatch({
      type: REFRESH_TOKEN,
      payload: token,
    });
  }, refreshTokenTime);
};


export const login = data => async dispatch => {
  dispatch({ type: SPINNER_SET });

  const credentials = {
    Login: data.email,
    Password: data.password,
    ClientType: 2,
  };

  try {
    const { Token, Refresh, Expires } = await callApi('user', 'LoginUser', credentials);

    localStorage.setItem('Token', Token);
    localStorage.setItem('RefreshToken', Refresh);
    localStorage.setItem('Expires', Expires);

    const { User: { ConfirmationSent } } = await callApi('user', 'GetCurrentUser');

    if (ConfirmationSent &&
        moment.unix(ConfirmationSent).add(2, 'days').unix() < moment().unix()) {
      dispatch(showMessages('Account is blocked. Email confirmation is expired.', 'error'));

      localStorage.removeItem('Token');
      localStorage.removeItem('RefreshToken');
      localStorage.removeItem('Expires');
    } else {
      Cookies.remove('Authorization');
      Cookies.set('Authorization', localStorage.getItem('Token'));

      doRefreshToken(Expires, dispatch);

      dispatch({ type: LOGIN });
      browserHistory.push('/admin');
    }
  } catch (error) {
    console.error('login action error:', error);

    dispatch({
      type: LOGIN_ERROR,
      payload: error.message,
    });
  } finally {
    dispatch({ type: SPINNER_UNSET });
  }
};


export const signUp = data => async dispatch => {
  dispatch({ type: SPINNER_SET });

  const userData = {
    FirstName: data.FirstName,
    LastName: data.LastName,
    Login: data.email,
    Password: data.password,
    Skype: data.skype,
    Phone: data.phone,
  };

  try {
    const { Token, Refresh, Expires } = await callApi('user', 'AddUser', userData);

    localStorage.setItem('Token', Token);
    localStorage.setItem('RefreshToken', Refresh);
    localStorage.setItem('Expires', Expires);

    Cookies.remove('Authorization');
    Cookies.set('Authorization', localStorage.getItem('Token'));

    doRefreshToken(Expires, dispatch);

    dispatch({ type: SIGN_UP_SUCCESS });
    dispatch({ type: SPINNER_UNSET });
    dispatch({ type: TUTORIAL_START });

    browserHistory.push('/admin');
  } catch (error) {
    console.error('Error, Look at action index.js signUp action AddUser', error);

    dispatch({
      type: SIGN_UP_ERR,
      payload: error.message,
    });
    dispatch({ type: SPINNER_UNSET });
  }
};


export const deAnonymize = credentials => async dispatch => {
  dispatch({ type: SPINNER_SET });

  const { FirstName, LastName, email: Login, password: Password, Skype, Phone } = credentials;

  try {
    const { Token, Refresh, Expires } = await callApi('user', 'DeAnonymizeUser', {
      FirstName, LastName, Login, Password, Skype, Phone,
    });
    localStorage.setItem('Token', Token);
    localStorage.setItem('RefreshToken', Refresh);
    localStorage.setItem('Expires', Expires);
    Cookies.remove('Authorization');
    Cookies.set('Authorization', Token);
    dispatch({ type: SIGN_UP_SUCCESS });
    dispatch(fetchCurrentUser());

    localStorage.removeItem('ExpiresAccount');
    dispatch(showMessages('Account was successfuly registred! Welcome aboard', 'success'));
    browserHistory.push('/admin/settings/trackers');
  } catch (error) {
    console.error('Error, Look at action index.js deAnonymize action', error);

    dispatch({
      type: SIGN_UP_ERR,
      payload: error.message,
    });
  } finally {
    dispatch({ type: SPINNER_UNSET });
  }
};


export const signUpLater = () => async dispatch => {
  dispatch({ type: SPINNER_SET });

  try {
    const { Token, Refresh, Expires } = await callApi('user', 'AddAnonymUser', {});

    localStorage.setItem('Token', Token);
    localStorage.setItem('RefreshToken', Refresh);
    localStorage.setItem('Expires', Expires);
    localStorage.setItem('ExpiresAccount', moment().unix() + 604800);// 1 week later

    Cookies.remove('Authorization');
    Cookies.set('Authorization', localStorage.getItem('Token'));

    doRefreshToken(Expires, dispatch);

    dispatch({ type: SIGN_UP_SUCCESS });
    dispatch({ type: SPINNER_UNSET });
    dispatch({ type: TUTORIAL_START });

    browserHistory.push('/admin');
  } catch (error) {
    console.error('Error, Look at action index.js signUpLater action err', error.message);

    dispatch({
      type: SIGN_UP_LATER_ERR,
      payload: error.message,
    });

    dispatch({ type: SPINNER_UNSET });
  }
};

export const logout = () => dispatch => {
  localStorage.setItem('currentUserId', 'unauthorized');
  localStorage.clear();
  clearInterval(refreshInterval);

  dispatch({ type: LOGOUT });
};


export const forgotPwd = data => async dispatch => {
  dispatch({ type: SPINNER_SET });

  try {
    const { Result } = await callApi('user', 'ForgotPwdSendEmail', { Login: data.email });

    if (Result) {
      dispatch({
        type: FORGOT_PASSWORD_SENT,
        payload: {
          msg: 'Successful request! Check your email for next instructions',
          className: 'success',
        },
      });
      dispatch({ type: SPINNER_UNSET });
    } else {
      dispatch({
        type: NOT_USER_EXISTED,
        payload: {
          msg: 'This email doesn\'t exist. Recovery failed',
          className: 'error',
        },
      });

      dispatch({ type: SPINNER_UNSET });
    }
  } catch (error) {
    console.error('Error, Look at action index.js forgotPassword action', error);

    dispatch(showMessages('Something was wrong...', error.message));
    dispatch({ type: SPINNER_UNSET });
  }
};


export const resetPassword = data => async dispatch => {
  dispatch({ type: SPINNER_SET });

  try {
    await callApi('user', 'ForgotPwdReset', { Code: data.code, NewPassword: data.newPassword });

    dispatch({ type: SPINNER_UNSET });

    dispatch(showMessages('Password changed successfully!', 'success'));

    browserHistory.push('/admin/login');
  } catch (error) {
    console.error('Error, Look at action index.js resetPassword action', error);

    dispatch({
      type: PWD_RESET_ERROR,
      payload: error.message,
    });
    dispatch({ type: SPINNER_UNSET });
  }
};

export const isInvalidResetPass = code => async dispatch => {
  dispatch({ type: SPINNER_SET });
  try {
    await callApi('user', 'ForgotPwdCheckCode', { Code: code });
    dispatch({ type: SPINNER_UNSET });
  } catch (err) {
    dispatch({
      type: PWD_RESET_ERROR,
      payload: err.message,
    });
    dispatch({ type: SPINNER_UNSET });
  }
};

export const hideError = () => ({
  type: SIGN_UP_ERR_HIDE,
});

export const hideSignUpLaterError = () => ({
  type: SIGN_UP_LATER_ERR_HIDE,
});

export const hideSingInError = () => ({
  type: SING_IN_ERROR,
});

export const hideSignupSuccessMessage = () => ({
  type: HIDE_SUCCESS_SIGNUP,
});


export const clearMessage = () => dispatch => {
  dispatch({
    type: CLEAR_MESSAGE,
  });
};

export const tokenAuthentication = () => async dispatch => {
  const RefreshToken = localStorage.getItem('RefreshToken');

  if (RefreshToken) {
    try {
      const { Token, Refresh, Expires } = await callApi('user', 'RefreshToken', { Refresh: RefreshToken });

      localStorage.setItem('Token', Token);
      localStorage.setItem('RefreshToken', Refresh);
      localStorage.setItem('Expires', Expires);

      doRefreshToken(Expires, dispatch);

      Cookies.remove('Authorization');
      Cookies.set('Authorization', localStorage.getItem('Token'));

      dispatch({ type: LOGIN });
      const { Settings: userSettings } = await callApi('user', 'GetUserSettings');
      if (!_.some(userSettings, { Key: 'Tutorial_Desktop_v1', Value: 'complete' })) {
        dispatch({ type: TUTORIAL_START });
      }
    } catch (error) {
      console.error('tokenAuthentication Error', error);

      Cookies.remove('Authorization');
      localStorage.clear();
      browserHistory.push('/admin/login');
    }
  } else {
    Cookies.remove('Authorization');
    localStorage.clear();
    browserHistory.push('/admin/login');
  }
};

export const identifyUserByTracker = tracker => async dispatch => {
  try {
    dispatch({
      type: START_DEANONYMIZE,
      payload: false,
    });

    const { User: { Name, Mail: Login } } = await callApi('tracker', 'GetCurrentUser', { TrackerID: tracker.ID });

    if (Login) {
      const { FirstName, LastName } = splitName(Name, Login);

      if (!FirstName || !LastName) throw new Error('Cannot find user name');
      await callApi('user', 'DeAnonymizeUserByTracker', { FirstName, LastName, Login });

      dispatch({
        type: REGISTER_USER_DATA,
        payload: {
          Login,
          FirstName,
          LastName,
          IsAnonymous: false,
        },
      });

      dispatch({ type: SHOW_CHECK_MAIL });
    } else {
      browserHistory.push('/admin/settings/add_tracker');
    }
  } catch (error) {
    console.error('identifyUserByTracker Error', error);

    browserHistory.push('/admin/settings/profile');
  }
};

export const hideCheckMail = () => ({
  type: HIDE_CHECK_MAIL,
});

export const createHiddenAnonym = () => async dispatch => {
  dispatch({ type: SPINNER_SET });

  try {
    const { Token, Refresh, Expires } = await callApi('user', 'AddAnonymUser');

    localStorage.setItem('TokenHidden', Token);
    localStorage.setItem('RefreshTokenHidden', Refresh);
    localStorage.setItem('ExpiresHidden', Expires);
    localStorage.setItem('ExpiresAccountHidden', moment().unix() + 604800);// 1 week later

    dispatch({
      type: HAS_REGISTRATION_SESSION,
      payload: true,
    });

    doRefreshToken(Expires, dispatch, 'RefreshTokenHidden');

    dispatch({ type: SPINNER_UNSET });
  } catch (error) {
    console.error('Error, Look at action index.js createAnonym action err', error.message);

    dispatch({ type: SPINNER_UNSET });
  }
};


export const hiddenTokenRefresh = () => async dispatch => {
  try {
    dispatch({ type: SPINNER_SET });
    const RefreshTokenHidden = localStorage.getItem('RefreshTokenHidden');
    const { Token, Refresh, Expires } = await callApi('user', 'RefreshToken', { Refresh: RefreshTokenHidden });

    localStorage.setItem('TokenHidden', Token);
    localStorage.setItem('RefreshTokenHidden', Refresh);
    localStorage.setItem('ExpiresHidden', Expires);

    doRefreshToken(Expires, dispatch, 'RefreshTokenHidden');

    dispatch({
      type: HAS_REGISTRATION_SESSION,
      payload: true,
    });
    dispatch({ type: SPINNER_UNSET });
  } catch (error) {
    console.error('Error, Look at action index.js hiddenTokenRefresh action err', error.message);
    dispatch({ type: SPINNER_UNSET });
  }
};

export const clearTemporaryUser = () => dispatch => {
  dispatch({ type: KILL_TEMPORARY_USER });
	 clearInterval(refreshInterval);
};

export const findUserByTracker = (tracker, hiddenTokenName) => async dispatch => {
  try {
    const paramsToken = hiddenTokenName ? [undefined, undefined, hiddenTokenName] : [];

    dispatch({ type: SPINNER_SET });

    const { User: { Name, Mail: Login } } = await callApi('tracker', 'GetCurrentUser', { TrackerID: tracker.ID }, ...paramsToken);

    if (!Login) throw new Error('Cannot get mail');
    const { FirstName, LastName } = splitName(Name, Login);

    if (!FirstName || !LastName) throw new Error('Cannot find user name');

    dispatch({
      type: FINDED_USER_INFO,
      payload: {
        FirstName,
        LastName,
        Login,
      },
    });
  } catch (error) {
    console.error('identifyUserByTracker Error', error);

    dispatch({
      type: FINDED_USER_INFO_ERROR,
      payload: error.message,
    });
  } finally {
    dispatch({ type: SPINNER_UNSET });
  }
};


export const unhideUser = (FirstName, LastName, Login, hiddenTokenName) => async dispatch => {
  dispatch({ type: SPINNER_SET });

  try {
    if (FirstName && LastName && Login) {
      const paramsToken = hiddenTokenName ? [undefined, undefined, hiddenTokenName] : [];

      await callApi('user', 'DeAnonymizeUserByTracker', { FirstName, LastName, Login }, ...paramsToken);

      dispatch({
        type: UNHIDE_USER_ERROR,
        payload: '',
      });

      const Token = localStorage.getItem('TokenHidden');
      const Refresh = localStorage.getItem('RefreshTokenHidden');
      const Expires = localStorage.getItem('ExpiresHidden');
      const ExpiresAccount = localStorage.getItem('ExpiresAccountHidden');

      Cookies.remove('Authorization');
      Cookies.set('Authorization', Token);

      localStorage.clear();

      localStorage.setItem('Token', Token);
      localStorage.setItem('RefreshToken', Refresh);
      localStorage.setItem('Expires', Expires);
      localStorage.setItem('ExpiresAccount', ExpiresAccount);

      dispatch({ type: SIGN_UP_SUCCESS });
      dispatch({ type: SPINNER_UNSET });
      dispatch({ type: SHOW_CHECK_MAIL });
      browserHistory.push('/admin');
    }
  } catch (error) {
    console.error('unhideUser Error', error);

    dispatch({
      type: UNHIDE_USER_ERROR,
      payload: error.message,
    });
    dispatch({ type: SPINNER_UNSET });
  }
};


import * as options from './options.js';
import * as login from './login.js';
import * as loginContainer from './login-container';

export type LoginFlowErrorType = login.LoginFlowErrorType;

export type LoginOptions = login.LoginOptions;

export const LoginFlowError = login.LoginFlowError;

export const LoginContainer = loginContainer.default;

export type LoginWindow = loginContainer.LoginWindow;

export const LoginWindowPopup = loginContainer.LoginWindowPopup;

export const startLogin = login.startLogin;

export const startLoginContainer = login.startLoginContainer;

export const awaitLoginContainer = login.awaitLoginContainer;

export const isLoggedIn = login.isLoggedIn;

export const setup = options.setup;

export default {
  LoginFlowError,
  startLogin,
  startLoginContainer,
  awaitLoginContainer,
  isLoggedIn,
  setup,
  LoginContainer,
  LoginWindowPopup,
};


import * as options from './options.js';
import * as login from './login.js';

export const LoginFlowError = login.LoginFlowError;

export type LoginFlowErrorType = login.LoginFlowErrorType;

export const startLogin = login.startLogin;

export type LoginOptions = login.LoginOptions;

export const isLoggedIn = login.isLoggedIn;

export const setup = options.setup;


export default 
{
  startLogin: login.startLogin,
  setup: options.setup,
  isLoggedIn: login.isLoggedIn,
};

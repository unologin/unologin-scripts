import * as options from './options.js';
import * as login from './login.js';
import * as loginContainer from './login-container';
// eslint-disable-next-line no-redeclare
export const LoginFlowErrorType = login.LoginFlowErrorType;
export const LoginFlowError = login.LoginFlowError;
export const LoginContainer = loginContainer.default;
export const LoginWindowPopup = loginContainer.LoginWindowPopup;
export const LoginWindowIFrameExperimental = loginContainer.LoginWindowIFrameExperimental;
export const startLogin = login.startLogin;
export const startLoginContainer = login.startLoginContainer;
export const awaitLoginContainer = login.awaitLoginContainer;
export const isLoggedIn = login.isLoggedIn;
export const setup = options.setup;
export default {
    LoginFlowError,
    LoginFlowErrorType,
    startLogin,
    startLoginContainer,
    awaitLoginContainer,
    isLoggedIn,
    setup,
    LoginContainer,
    LoginWindowPopup,
};

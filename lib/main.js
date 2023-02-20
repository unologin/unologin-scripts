import * as options from './options';
import * as login from './login';
export const LoginFlowError = login.LoginFlowError;
export const startLogin = login.startLogin;
export const isLoggedIn = login.isLoggedIn;
export const setup = options.setup;
export default {
    startLogin: login.startLogin,
    setup: options.setup,
    isLoggedIn: login.isLoggedIn,
};

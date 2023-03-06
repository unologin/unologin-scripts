import * as options from './options.js';
import * as login from './login.js';
export declare const LoginFlowError: typeof login.LoginFlowError;
export type LoginFlowErrorType = login.LoginFlowErrorType;
export declare const startLogin: typeof login.startLogin;
export type LoginOptions = login.LoginOptions;
export declare const isLoggedIn: typeof login.isLoggedIn;
export declare const setup: typeof options.setup;
declare const _default: {
    startLogin: typeof login.startLogin;
    setup: typeof options.setup;
    isLoggedIn: typeof login.isLoggedIn;
};
export default _default;

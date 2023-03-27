/**
 * @module login
 */
import * as options from './options.js';
import LoginContainer, { LoginWindowPopup, } from './login-container.js';
import { removeUndefined, } from './util.js';
export var LoginFlowErrorType;
(function (LoginFlowErrorType) {
    LoginFlowErrorType["Unknown"] = "Unknown";
    LoginFlowErrorType["ClosedByUser"] = "ClosedByUser";
})(LoginFlowErrorType || (LoginFlowErrorType = {}));
/**
 * Error thrown by {@link startLogin}
 */
export class LoginFlowError extends Error {
    /**
     *
     * @param message message
     * @param type type {@link LoginFlowErrorType}
     */
    constructor(message, type) {
        super(message);
        this.type = type;
    }
}
/**
 * Supported authentication methods.
 */
export var AuthMethod;
(function (AuthMethod) {
    AuthMethod["google"] = "google";
    AuthMethod["email"] = "email";
})(AuthMethod || (AuthMethod = {}));
/**
 * Creates a URL to the OAuth flow which in turn redirects to
 * the provided loginUrl after successful OAuth.
 *
 * @param provId auth method
 * @param loginUrl login url
 * @returns url for
 */
export function createOAuthUrl(provId, loginUrl) {
    const url = new URL('/initial-auth/' + provId, options.get().api);
    url.searchParams.set('loginUrl', loginUrl.href);
    return url;
}
/**
 * Creates a login url based on the realm and the provided options.
 *
 * @param loginOptions {@link main.LoginOptions}
 *
 * @returns URL
 */
export function createLoginUrl(loginOptions = {}) {
    loginOptions = removeUndefined(Object.assign({ client: 'Web', appId: options.get().appId, userClass: 'users_default', callbackUrl: options.get().callbackUrl }, loginOptions));
    const provId = loginOptions.authMethod;
    const loginUrl = new URL(options.get().realm);
    for (const [k, v] of Object.entries(loginOptions)) {
        loginUrl.searchParams.set(k, v);
    }
    if (provId === 'email' || !provId) {
        return loginUrl;
    }
    else {
        return createOAuthUrl(provId, loginUrl);
    }
}
/**
 * Starts the login process.
 * Returns a promise that resolves as soon as the popup closes.
 *
 * @param loginOptions containing the userClass
 * @param buildLoginWindow optional container to render the login flow in
 *
 * @returns Promise<void>
 *
 * @throws error {@link LoginFlowError}
 */
export function startLoginContainer(loginOptions = {}, buildLoginWindow) {
    const url = createLoginUrl(loginOptions);
    const loginWindow = buildLoginWindow ?
        buildLoginWindow(url) :
        new LoginWindowPopup({
            url,
            title: 'unolog·in',
        });
    return LoginContainer.start(loginWindow);
}
/**
 * Wraps login container in a promise.
 *
 * @param container container
 *
 * @returns Promise<void>
 *
 * @throws LoginFlowError {@link LoginFlowError}
 */
export function awaitLoginContainer(container) {
    return new Promise((resolve, reject) => {
        container.onLogin(({ success }) => {
            container.close();
            if (success) {
                resolve();
            }
            else {
                reject(new LoginFlowError('Unknown cause.', LoginFlowErrorType.Unknown));
            }
        });
        container.onClosed(() => reject(new LoginFlowError('Login flow closed by user.', LoginFlowErrorType.ClosedByUser)));
    });
}
/**
 * Starts the login process and creates a promise around it.
 * Returns a promise that resolves as soon as the popup closes.
 *
 * @param loginOptions containing the userClass
 * @param buildLoginWindow optional container to render the login flow in
 *
 * @returns Promise<void>
 *
 * @throws LoginFlowError {@link LoginFlowError}
 */
export function startLogin(loginOptions = {}, buildLoginWindow) {
    const container = startLoginContainer(loginOptions, buildLoginWindow);
    return awaitLoginContainer(container);
}
/**
 * Check if the user *appears* to be logged in from the client side.
 * *Do NOT use for authentication* as the result may be tempered with.
 *
 * @param documentCookie Optional cookie string (for testing).
 * @returns true if the user *appears* to be logged in.
 */
export function isLoggedIn(documentCookie) {
    return !!((documentCookie || document.cookie).match(/^(.*;)?\s*_uno_loginState\s*=\s*[^;]+(.*)?$/));
}

/**
 * @module login
 */
import * as options from './options';
import PopupProcess from './popup-process';
export var LoginFlowErrorType;
(function (LoginFlowErrorType) {
    LoginFlowErrorType["Unknown"] = "Unknown";
    LoginFlowErrorType["ClosedByUser"] = "ClosedByUser";
})(LoginFlowErrorType || (LoginFlowErrorType = {}));
/**
 *
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
    loginOptions =
        {
            client: 'Web',
            appId: options.get().appId,
            userClass: 'users_default',
            ...loginOptions,
        };
    const provId = loginOptions.authMethod;
    const loginUrl = new URL('/', options.get().realm);
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
 *
 * @returns Promise<void>
 *
 * @throws {@link LoginFlowError}
 */
export function startLogin(loginOptions = {}) {
    const url = createLoginUrl(loginOptions);
    const popup = PopupProcess.start({
        url,
        title: 'unolog·in',
    });
    return new Promise((resolve, reject) => {
        popup.onLogin(({ success }) => {
            popup.close();
            if (success) {
                resolve();
            }
            else {
                reject(new LoginFlowError('Unknown cause.', LoginFlowErrorType.Unknown));
            }
        });
        popup.onClosed(() => reject(new LoginFlowError('Login flow closed by user.', LoginFlowErrorType.ClosedByUser)));
    });
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

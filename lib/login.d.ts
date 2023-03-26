/**
 * @module login
 */
import LoginContainer, { LoginWindow } from './login-container.js';
export declare enum LoginFlowErrorType {
    Unknown = "Unknown",
    ClosedByUser = "ClosedByUser"
}
/**
 * Error thrown by {@link startLogin}
 */
export declare class LoginFlowError extends Error {
    readonly type: LoginFlowErrorType;
    /**
     *
     * @param message message
     * @param type type {@link LoginFlowErrorType}
     */
    constructor(message: string, type: LoginFlowErrorType);
}
/**
 * Supported authentication methods.
 */
export declare enum AuthMethod {
    'google' = "google",
    'email' = "email"
}
/**
 * Options for constructing the login flow.
 *
 * @see {@link startLogin}
 */
export interface LoginOptions {
    /** Which user class to add when logging in. */
    userClass?: string;
    /** Pre-select a mode. Defaults to automatic detection. */
    mode?: 'login' | 'register';
    /** Client (must be 'Web') */
    client?: 'Web';
    /** appId inferred from settings */
    appId?: string;
    /**
     * Signup-code for user classes that require a code to sign up.
     * If not set, the user may be prompted to enter a signup code.
     */
    code?: string;
    /**
     * Pre-select a login method.
     * Defaults to asking the user.
     */
    authMethod?: AuthMethod;
    /**
     * Override the callbackUrl.
     * Needs to be whitelisted in the dashboard.
     */
    callbackUrl?: URL | string;
}
/**
 * Creates a URL to the OAuth flow which in turn redirects to
 * the provided loginUrl after successful OAuth.
 *
 * @param provId auth method
 * @param loginUrl login url
 * @returns url for
 */
export declare function createOAuthUrl(provId: AuthMethod, loginUrl: URL): URL;
/**
 * Creates a login url based on the realm and the provided options.
 *
 * @param loginOptions {@link main.LoginOptions}
 *
 * @returns URL
 */
export declare function createLoginUrl(loginOptions?: LoginOptions): URL;
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
export declare function startLoginContainer(loginOptions?: LoginOptions, buildLoginWindow?: (url: URL) => LoginWindow): LoginContainer;
/**
 * Wraps login container in a promise.
 *
 * @param container container
 *
 * @returns Promise<void>
 *
 * @throws LoginFlowError {@link LoginFlowError}
 */
export declare function awaitLoginContainer(container: LoginContainer): Promise<void>;
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
export declare function startLogin(loginOptions?: LoginOptions, buildLoginWindow?: (url: URL) => LoginWindow): Promise<void>;
/**
 * Check if the user *appears* to be logged in from the client side.
 * *Do NOT use for authentication* as the result may be tempered with.
 *
 * @param documentCookie Optional cookie string (for testing).
 * @returns true if the user *appears* to be logged in.
 */
export declare function isLoggedIn(documentCookie?: string): boolean;

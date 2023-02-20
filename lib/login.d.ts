/**
 * @module login
 */
export declare enum LoginFlowErrorType {
    Unknown = "Unknown",
    ClosedByUser = "ClosedByUser"
}
/**
 *
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
 *
 * @returns Promise<void>
 *
 * @throws {@link LoginFlowError}
 */
export declare function startLogin(loginOptions?: LoginOptions): Promise<void>;
/**
 * Check if the user *appears* to be logged in from the client side.
 * *Do NOT use for authentication* as the result may be tempered with.
 *
 * @param documentCookie Optional cookie string (for testing).
 * @returns true if the user *appears* to be logged in.
 */
export declare function isLoggedIn(documentCookie?: string): boolean;

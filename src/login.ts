/**
 * @module login
 */

import * as options from './options.js';

import LoginContainer, { 
  LoginWindow, 
  LoginWindowPopup, 
} from './login-container.js';
import { removeUndefined } from './util.js';

export enum LoginFlowErrorType
{
  Unknown = 'Unknown',
  ClosedByUser = 'ClosedByUser',
}

/**
 * Error thrown by {@link startLogin}
 */
export class LoginFlowError
  extends Error
{
  /**
   * 
   * @param message message
   * @param type type {@link LoginFlowErrorType}
   */
  constructor(
    message : string, 
    public readonly type : LoginFlowErrorType,
  )
  {
    super(message);
  }
}

/**
 * Supported authentication methods.
 */
export enum AuthMethod
{
  'google' = 'google',
  'email' = 'email',
}

/**
 * Options for constructing the login flow.
 * 
 * @see {@link startLogin}
 */
export interface LoginOptions
{
  /** Which user class to add when logging in. */
  userClass?: string;

  /** Pre-select a mode. Defaults to automatic detection. */
  mode?: 'login' | 'register';

  /** Client (must be 'Web') */
  client?: 'Web',

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
export function createOAuthUrl(
  provId : AuthMethod,
  loginUrl : URL,
)
{
  const url = new URL(
    '/initial-auth/' + provId,
    options.get().api,
  );

  url.searchParams.set(
    'loginUrl',
    loginUrl.href,
  );

  return url;
}

/**
 * Creates a login url based on the realm and the provided options.
 * 
 * @param loginOptions {@link main.LoginOptions}
 * 
 * @returns URL
 */
export function createLoginUrl(
  loginOptions : LoginOptions = {},
) : URL
{
  loginOptions = removeUndefined(
    {
      client: 'Web',
      appId: options.get().appId,
      userClass: 'users_default',
      callbackUrl: options.get().callbackUrl,
      ...loginOptions,
    },
  );

  const provId = loginOptions.authMethod;

  const loginUrl = new URL(options.get().realm);

  for (const [k, v] of Object.entries(loginOptions))
  {
    loginUrl.searchParams.set(k, v);
  }

  if (provId === 'email' || !provId)
  {
    return loginUrl;
  }
  else 
  {
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
export function startLoginContainer(
  loginOptions : LoginOptions = {},
  buildLoginWindow?: (url : URL) => LoginWindow,
)
{
  const url = createLoginUrl(loginOptions);
 
  const loginWindow = buildLoginWindow ?
    buildLoginWindow(url) : 
    new LoginWindowPopup(
      {
        url,
        title: 'unolog·in',
      },
    );

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
export function awaitLoginContainer(
  container : LoginContainer,
)
{
  return new Promise<void>(
    (resolve, reject) => 
    {
      container.onLogin(
        ({ success }) => 
        {
          container.close();
   
          if (success)
          {
            resolve();
          }
          else 
          {
            reject(
              new LoginFlowError(
                'Unknown cause.',
                LoginFlowErrorType.Unknown,
              ),
            );
          }
        },
      );
 
      container.onClosed(
        () => reject(
          new LoginFlowError(
            'Login flow closed by user.',
            LoginFlowErrorType.ClosedByUser,
          ),
        ),
      );
    },
  );
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
export function startLogin(
  loginOptions : LoginOptions = {},
  buildLoginWindow?: (url : URL) => LoginWindow,
) : Promise<void>
{
  const container = startLoginContainer(
    loginOptions,
    buildLoginWindow,
  );
 
  return awaitLoginContainer(container);
}

/**
 * Check if the user *appears* to be logged in from the client side.
 * *Do NOT use for authentication* as the result may be tempered with.
 *
 * @param documentCookie Optional cookie string (for testing).
 * @returns true if the user *appears* to be logged in.
 */
export function isLoggedIn(documentCookie?: string) : boolean
{
  return !!(
    (
      documentCookie || document.cookie
    ).match(/^(.*;)?\s*_uno_loginState\s*=\s*[^;]+(.*)?$/)
  );
}

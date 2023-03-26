
export interface Options
{
  /**
   * Your appId.
   */
  appId: string;

  /**
   * Which base URL to use for the login flow.
   * Defaults to https://login.unolog.in
   */
  realm: string;
  
  /**
   * Optional API URL the frontend is using.
   * May be inferred from realm.
   */
  api: string;

  /**
   * Optional callback URL.
   * Defaults to the first URL in the whitelist configured 
   * on the dashboard.
   */
  callbackUrl?: URL | string;
}

const defaultOptions = 
{
  realm: 'https://login.unolog.in',
};

// app settings
let options : Options | null = null;

/**
 * API url for current realm
 * @param realm realm URL
 * @returns {string} API URL
 */
function getAPIUrlFromRealm(realm : string) : string
{
  if (realm.startsWith('https://login'))
  {
    return realm.replace('https://login', 'https://api');
  }
  else 
  {
    throw Error(
      'Invalid configuration! Missing "api" in options.',
    );
  }
}

/** 
 * Allows setting appId and realm.
 * 
 * @param params appId and realm
 * 
 * @returns void 
 */
export function setup(
  params : Pick<Options, 'appId'> & Partial<Options>,
) : void
{
  const api = 
    params.api ||
    getAPIUrlFromRealm(
      params.realm || defaultOptions.realm,
    );

  options = 
  {
    ...defaultOptions,
    ...params,
    api,
  };
}

/** @returns options */
export function get() : Options
{
  if (options)
  {
    return options;
  }
  else
  {
    throw new Error('Please call setup(...) before using the library.');
  }
}

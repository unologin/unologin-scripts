
export interface SetupParams
{
  // which base url to use for unologin, defaults to https://login.unolog.in.
  realm?: string;
  
  // optional API the frontend is using may be inferred from realm 
  api?: string;

  // appId of your unologin app
  appId: string;
}

interface Setup extends SetupParams
{
  realm: string;
}

// app settings
let options : Setup | null = null;

/**
 * @returns API url for current realm
 */
export function getAPIUrl()
{
  const realm = get().realm;

  if (realm.startsWith('https://login'))
  {
    return realm.replace('https://login', 'https://api');
  }
  else 
  {
    const apiUrl = get().api;
    
    if (apiUrl)
    {
      return apiUrl;
    }
    else 
    {
      throw Error(
        'Invalid configuration! Missing "api" in options.',
      );
    }
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
  { appId, realm } : SetupParams
) : void
{
  options = 
  {  
    realm: realm || 'https://login.unolog.in',
    appId,
  };
}

/** @returns options */
export function get() : Setup
{
  if (!options)
  {
    throw new Error('Please call setup(...) before using the library.');
  }

  return options;
}

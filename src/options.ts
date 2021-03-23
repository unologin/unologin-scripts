
export interface SetupParams
{
  // which base url to use for unologin, defaults to https://unolog.in.
  realm?: string;
  
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
    realm: realm || 'https://unolog.in',
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

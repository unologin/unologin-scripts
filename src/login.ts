
import { runLoginHandlers } from './events';

import * as options from './options';

import { startCheckout } from './popup-process';

interface LoginMessage
{
  appLoginToken: string;
  invoiceId?: string | null;
}

/**
 * 
 * @param param0 see LoginMessage
 * @returns {Promise<void>} void
 */
export async function login(
  { appLoginToken, invoiceId } : LoginMessage
) : Promise<void>
{
  // store the temporary login token
  if (appLoginToken)
  {
    document.cookie = 
      '_uno_appLoginTokenTmp=' + 
      appLoginToken + 
      ';domain=' + 
      options.get().cookiesDomain + 
      '; path=/';
  }

  if (appLoginToken)
  {
    await runLoginHandlers();
  }
  else
  {
    await runLoginHandlers(new Error('login failed'));
  }
  
  // if there is an invoice to pay for
  if (invoiceId)
  {
    startCheckout(invoiceId);
  }
}

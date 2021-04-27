
import { login } from './login';

type Callback = (error?: Error) => void | Promise<void>;

import * as options from './options';

const loginHandlers : Callback[] = [];
const checkoutHandlers : Callback[] = [];

/** 
 * @param fnc callback
 * @returns {void} 
 */
export function onLogin(fnc : Callback) : void
{
  loginHandlers.push(fnc);
}

/**
 * @param fnc callback
 * @returns {void} 
 */
export function onCheckout(fnc : Callback) : void
{
  checkoutHandlers.push(fnc);
}

/**
 * @param {Callback[]} handlers the handlers
 * @param {Error} error optional error
 * @returns {Promise<void>} void
 */
async function runHandlers(handlers : Callback[], error?: Error) : Promise<void>
{
  for (const handler of handlers) await handler(error);
}

/**
 * Executes callbacks for login.
 * @param error Error if any.
 * @returns {Promise<void>} void
 */
export async function runLoginHandlers(error?: Error) : Promise<void>
{
  return await runHandlers(loginHandlers, error);
}

/**
 * Executes callbacks for checkout.
 * @param error Error if any.
 * @returns {Promise<void>} void
 */
export async function runCheckoutHandlers(error?: Error) : Promise<void>
{
  return await runHandlers(checkoutHandlers, error);
}

/**
 * Checks query parameters for events
 * @returns {void}
 */
async function checkQuery() : Promise<void>
{
  const params = new URLSearchParams(window.location.search);

  const success = params.get('_uno_loginSuccess') === 'true';
  const invoiceId = params.get('_uno_invoiceId');

  if (params.get('_uno_loginSuccess'))
  {
    // fallback has been triggered and we're still in the popup
    if (window.opener)
    {
      // reload the parent location to apply the login
      window.opener.location = window.location;
      // close the popup
      window.close();
    }

    await login({ invoiceId, success });

    // if the user isn't taken somewhere else, remove the query parameters
    const url = new URL(window.location.href);

    url.searchParams.delete('_uno_loginSuccess');
    url.searchParams.delete('_uno_invoiceId');

    window.location.replace(url.href);
  }
}

/** 
 * @param event event 
 * @returns {Promise<void>} void
 */
async function onMessage(event : MessageEvent) : Promise<void>
{
  const realm = new URL(options.get().realm);

  if (event.origin === (realm.protocol + '//' + realm.host))
  {
    const msg = JSON.parse(event.data);

    if (msg.id == '_uno_onLoginInternal')
    {
      await login(msg);
    }
  }
}

// some framework (like nextjs) will load libraries on the server too
// which causes window to be undefined
if (typeof(window) !== 'undefined')
{
  window.addEventListener('load', checkQuery);
  window.addEventListener('message', onMessage);
}

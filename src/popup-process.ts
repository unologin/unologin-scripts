
import { openCenteredPopup } from './popup';

import * as options from './options';
import { onCheckout, onLogin } from './events';

export interface LoginOptions
{
  userClass: string;
  mode?: string;
}

interface PopupParams
{
  url : URL;
  title: string;
  width?: number; 
  height?: number;
}

// list of all processes that are currently active
const processes : { [k: string]: PopupProcess } = {};

/**
 * Wraps around a popup window (or a redirect in case a popup cannot be opened)
 */
export default class PopupProcess
{
  popup: Window | null;

  /** */
  constructor({url, title, width, height} : PopupParams)
  {
    this.popup = openCenteredPopup(url, title, width, height);
  }

  /** @returns true if the popup is still open */
  isActive() : boolean
  {
    return !!(this.popup && !this.popup.closed);
  }

  /** 
   * focuses the popup
   * @returns {void}
   */
  focus() : void
  {
    this.popup?.focus();
  }

  /**
   * closes the popup
   * @returns {void}
   */
  close() : void
  {
    this.popup?.close();
  }

  /**
   * @param params see PopupParams
   * 
   * @returns new PopupProcess or focuses an active one with the same id
   */
  static start(params : PopupParams)
  {
    const id = params.url.href;

    const process = processes[id];

    // if the process is already registered and still running
    if (process && process.isActive())
    {
      process.focus();

      return process;
    }
    else
    {
      return processes[id] = new PopupProcess(params);
    }
  }
}

/**
 * Creates a unologin url based on the realm from a path and a query object
 * 
 * @param path relative path
 * @param query query object
 * 
 * @returns url
 */
function createUrl(path : string, query : object) : URL
{
  const url = new URL(path, options.get().realm);

  for (const [k, v] of Object.entries(query))
  {
    url.searchParams.set(k, v);
  }

  return url;
}

/**
 * Starts the login process.
 * 
 * @param loginOptions containing the userClass 
 * @returns void
 */
export function startLogin(loginOptions : LoginOptions) : void
{
  const process = PopupProcess.start(
    {
      url: createUrl(
        '/app-signup/login/', 
        { ...loginOptions, client: 'Web', appId: options.get().appId }
      ),
      title: 'unolog·in',
    }
  );

  onLogin(() => { process.close(); } );
}

/**
 * Starts the checkout process.
 * 
 * @param invoiceId invoiceId for the checkout
 * @returns void
 */
export function startCheckout(invoiceId : string) : void
{
  const process = PopupProcess.start(
    {
      url: createUrl('/pay/checkout', {invoiceId}),
      title: 'unolog·in',
    }
  );

  onCheckout(() => { process.close(); } );
}

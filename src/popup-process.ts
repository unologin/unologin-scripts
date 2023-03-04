
import {
  openCenteredPopup, PopupMessage, PopupWindow,
} from './popup';

import * as options from './options';

/**
 * @internal
 */
export interface PopupParams
{
  url : URL;
  title: string;
  width?: number; 
  height?: number;
}

export type LoginResponse =
{
  success: boolean;
}

export type ClientLoginEventHandler = (
  msg : LoginResponse,
  event : MessageEvent,
) => unknown;

/**
 * Wraps around a popup window (or a redirect in case a popup cannot be opened).
 * @internal
 */
export default class PopupProcess
{
  // list of all processes that are currently active
  private static processes : { [k: string]: PopupProcess } = {};

  public readonly popup: PopupWindow | null;

  private closeListener : ReturnType<typeof setInterval>;

  public readonly messageHandlers = 
  {
    '_uno_onLoginInternal': <ClientLoginEventHandler[]>[],
    '_uno_onLoginClosed': <((msg: { success: boolean }) => void)[]>[],
  }

  /** */
  constructor({ url, title, width, height } : PopupParams)
  {
    this.popup = openCenteredPopup(url, title, width, height);

    if (typeof(window) !== 'undefined')
    {
      window.addEventListener(
        'message',
        (msg) => this.onMessage(msg),
      );
    }

    this.onClosed(
      () => clearInterval(this.closeListener),
    );
    
    this.onClosed(
      () => this.deleteFromCache(),
    );

    this.onLogin(
      () => clearInterval(this.closeListener),
    );

    this.closeListener = setInterval(
      () => 
      {
        if (!this.isActive())
        {
          this.runHandlers(
            this.messageHandlers._uno_onLoginClosed,
            { success: false },
          );
        }
      },
      500,
    );
  }


  /** 
   * @internal
   * @param event event 
   * @returns {Promise<void>} void
   */
  public onMessage(event : PopupMessage)
  {
    if (this.isMessageFromPopup(event))
    {
      let msg;
      
      try 
      {
        msg = JSON.parse(event.data);
      }
      catch (e)
      {
        throw new Error('Received invalid message: ' + event.data); 
      }

      const handlers = msg.id in this.messageHandlers ? 
        this.messageHandlers[msg.id as keyof typeof this.messageHandlers]:
        null
      ;

      handlers && this.runHandlers(handlers, msg, event as MessageEvent);
    }
  }

  /**
   * 
   * @param event event
   * @returns boolean
   */
  public isMessageFromPopup(event : PopupMessage)
  {
    const realm = new URL(options.get().realm);

    return (
      event.origin === (realm.protocol + '//' + realm.host) && 
      event.source === this.popup
    );
  }

  /**
   * Runs handlers and removes them.
   * @param handlers handlers
   * @param args args
   * 
   * @returns Promise<void[]>
   */
  private async runHandlers<Args extends Array<any>>(
    handlers : ((...args : Args) => unknown)[],
    ...args : Args
  )
  {
    let handler;

    const results = [];

    while (handler = handlers.pop())
    {
      results.push(handler(...args));
    }

    return Promise.all(results);
  }

  /**
   * @param fn handler function
   * @returns void
   */
  public onLogin(fn : ClientLoginEventHandler)
  {
    this.messageHandlers._uno_onLoginInternal.push(fn);
  }

  /**
   * @param fn handler function
   * @returns void
   */
  public onClosed(fn : () => unknown)
  {
    this.messageHandlers._uno_onLoginClosed.push(fn);
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
    this.deleteFromCache();
  }

  /**
   * @returns void
   */
  private deleteFromCache()
  {
    const entry = Object.entries(PopupProcess.processes).find(
      ([, p]) => p === this,
    );

    entry && delete PopupProcess.processes[entry[0]];
  }

  /**
   * @param params see PopupParams
   * 
   * @returns new PopupProcess or focuses an active one with the same id
   */
  static start(params : PopupParams)
  {
    const id = params.url.href;

    const process = PopupProcess.processes[id];

    // if the process is already registered and still running
    if (process && process.isActive())
    {
      process.focus();

      return process;
    }
    else
    {
      return PopupProcess.processes[id] = new PopupProcess(params);
    }
  }
}

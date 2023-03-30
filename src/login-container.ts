
import {
  openCenteredPopup, 
  PopupMessage, 
  PopupWindow,
} from './popup.js';

import * as options 
  from './options.js';

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

export type MessageEventHandlerProps = 
{
  runOnce: boolean;
  /** Number of executions. */
  n: number;
}

export type MessageEventHandler<T extends object> =
(
  (msg : T, event?: MessageEvent) => unknown
);

export type ClientLoginEventHandler = 
  MessageEventHandler<LoginResponse>;

export const messageIds = 
{
  '_uno_onLoginInternal': '_uno_onLoginInternal',
  '_uno_onLoginClosed': '_uno_onLoginClosed',
  '_uno_onLoginUrl': '_uno_onLoginUrl',
  '_uno_onResize': '_uno_onResize',
};

export type MessageId = keyof typeof messageIds;

export type MessageTypes = 
{
  '_uno_onLoginInternal': LoginResponse;
  '_uno_onLoginClosed': { success: boolean };
  '_uno_onLoginUrl': { loginUrl: string };
  '_uno_onResize': 
  {
    width: number;
    height: number;
  }
}

export type MessageHandlers =
{ 
  [ID in MessageId]: (
    MessageEventHandler<MessageTypes[ID]> & MessageEventHandlerProps
  )[]
}

export interface LoginWindow
{
  /** Initial login url. */
  url: URL;
  isActive: () => boolean;
  start?: (container : LoginContainer) => void;
  focus: () => void;
  close: () => void;
  isEventSource: (e : PopupMessage) => boolean;
}

/**
 * LoginWindow implementation via popup or redirect.
 */
export class LoginWindowPopup
implements LoginWindow
{
  private popup : PopupWindow | null = null;

  public url : URL;

  /**
   * @param params PopupParams
   */
  constructor(
    public readonly params : PopupParams,
  )
  { 
    this.url = params.url;
  }

  /** @returns void */
  start()
  {
    const { url, title, width, height } = this.params;

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
   * 
   * @param event event
   * @returns boolean
   */
  isEventSource(event : PopupMessage)
  {
    return event.source === this.popup;
  }
}

export type LoginWindowIFrameExperimentalParams = 
{
  url: URL;
  parentElement: HTMLElement;
}

/**
 * Experimental iframe based login.
 * @experimental
 */
export class LoginWindowIFrameExperimental
implements LoginWindow
{
  private iframe : HTMLIFrameElement | null = null;

  public url : URL;

  /**
   * @param url URL
   */
  constructor(
    public params : LoginWindowIFrameExperimentalParams,
  ) 
  {
    this.url = params.url;
  }

  /**
   * 
   * @param container loginContainer
   * @returns void
   */
  start()
  {
    this.iframe = document.createElement('iframe');

    this.iframe.src = this.url.href;

    this.params.parentElement.appendChild(this.iframe);
  }

  /** @returns true if the popup is still open */
  isActive() : boolean
  {
    return !!this.iframe;
  }

  /** 
   * focuses the popup
   * @returns {void}
   */
  focus() : void
  {
    this.iframe?.focus();
  }

  /**
   * closes the popup
   * @returns {void}
   */
  close() : void
  {
    this.iframe?.parentNode?.removeChild(this.iframe);
  }

  /**
   * 
   * @param event event
   * @returns boolean
   */
  isEventSource(event : PopupMessage)
  {
    return event.source === this.iframe;
  }
}

/**
 * Manages a popup window, iframe or redirect.
 * @internal
 */
export default class LoginContainer
{
  public static readonly containers : { [id: string]: LoginContainer } = {};

  private closeListener : ReturnType<typeof setInterval>;

  public readonly messageHandlers : MessageHandlers = 
  {
    '_uno_onLoginInternal': [],
    '_uno_onLoginClosed': [],
    '_uno_onResize': [],
    '_uno_onLoginUrl': [],
  }

  /** */
  constructor(
    public readonly loginWindow : LoginWindow,
  )
  {
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

      handlers && this.runHandlers<any>(handlers, msg, event as MessageEvent);
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
      this.loginWindow.isEventSource(event)
    );
  }

  /**
   * Runs handlers and removes them.
   * @param handlers handlers
   * @param msg message
   * @param event optional event 
   * 
   * @returns Promise<void[]>
   */
  private async runHandlers<T extends object>(
    handlers : (MessageEventHandler<T> & MessageEventHandlerProps)[],
    msg : T,
    event?: MessageEvent,
  )
  {
    return Promise.all(handlers
      .filter(
        (handler) => ((handler.n++) == 0 || !handler.runOnce),
      )
      .map(
        (handler) => handler(msg, event),
      ),
    );
  }

  /**
   * @param fn handler function
   * @returns void
   */
  public onLogin(fn : ClientLoginEventHandler)
  {
    return this.once('_uno_onLoginInternal', fn);
  }

  /**
   * @param fn handler function
   * @returns void
   */
  public onClosed(fn : () => unknown)
  {
    return this.once('_uno_onLoginClosed', fn);
  }

  /**
   * 
   * @param event event
   * @param fn fn
   * @returns void
   */
  public once<E extends keyof MessageTypes>(
    event : E, 
    fn: MessageEventHandler<MessageTypes[E]>,
  )
  {
    return this.on(event, fn, true);
  }

  /**
   * 
   * @param event event
   * @param fn fn
   * @param runOnce will detach the event handler after execution if set to true
   * @returns void
   */
  public on<E extends keyof MessageTypes>(
    event : E, 
    fn: MessageEventHandler<MessageTypes[E]>,
    runOnce = false,
  )
  {
    this.messageHandlers[event].push(
      Object.assign(fn, { runOnce, n: 0, ...fn }),
    );
  }

  /** @returns true if the login window is still open */
  isActive() : boolean
  {
    return this.loginWindow.isActive();
  }

  /** @returns void */
  start()
  {
    this.loginWindow.start?.(this);
  }

  /** 
   * focuses the login window
   * @returns {void}
   */
  focus() : void
  {
    this.loginWindow.focus();
  }

  /**
   * closes the login window
   * @returns {void}
   */
  close() : void
  {
    this.loginWindow.close();
    this.deleteFromCache();
  }

  /**
   * @returns void
   */
  private deleteFromCache()
  {
    const entry = Object.entries(LoginContainer.containers).find(
      ([, p]) => p === this,
    );

    entry && delete LoginContainer.containers[entry[0]];
  }

  /**
   * @param loginWindow LoginWindow implementation
   * 
   * @returns new LoginContainer or focuses an active one with the same id
   */
  static start(loginWindow : LoginWindow)
  {
    const id = loginWindow.url.href;

    let process = LoginContainer.containers[id];

    // if the process is already registered and still running
    if (process && process.isActive())
    {
      process.focus();

      return process;
    }
    else
    {
      process = LoginContainer.containers[id] = new LoginContainer(loginWindow);

      process.start();

      return process;
    }
  }
}

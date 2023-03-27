import { PopupMessage } from './popup.js';
/**
 * @internal
 */
export interface PopupParams {
    url: URL;
    title: string;
    width?: number;
    height?: number;
}
export type LoginResponse = {
    success: boolean;
};
export type MessageEventHandlerProps = {
    runOnce: boolean;
    /** Number of executions. */
    n: number;
};
export type MessageEventHandler<T extends object> = ((msg: T, event?: MessageEvent) => unknown);
export type ClientLoginEventHandler = MessageEventHandler<LoginResponse>;
export type MessageTypes = {
    '_uno_onLoginInternal': LoginResponse;
    '_uno_onLoginClosed': {
        success: boolean;
    };
    '_uno_onLoginUrl': {
        loginUrl: string;
    };
    '_uno_onResize': {
        width: number;
        height: number;
    };
};
export type MessageHandlers = {
    [ID in keyof MessageTypes]: (MessageEventHandler<MessageTypes[ID]> & MessageEventHandlerProps)[];
};
export interface LoginWindow {
    /** Initial login url. */
    url: URL;
    isActive: () => boolean;
    start?: (container: LoginContainer) => void;
    focus: () => void;
    close: () => void;
    isEventSource: (e: PopupMessage) => boolean;
}
/**
 * LoginWindow implementation via popup or redirect.
 */
export declare class LoginWindowPopup implements LoginWindow {
    readonly params: PopupParams;
    private popup;
    url: URL;
    /**
     * @param params PopupParams
     */
    constructor(params: PopupParams);
    /** @returns void */
    start(): void;
    /** @returns true if the popup is still open */
    isActive(): boolean;
    /**
     * focuses the popup
     * @returns {void}
     */
    focus(): void;
    /**
     * closes the popup
     * @returns {void}
     */
    close(): void;
    /**
     *
     * @param event event
     * @returns boolean
     */
    isEventSource(event: PopupMessage): boolean;
}
export type LoginWindowIFrameExperimentalParams = {
    url: URL;
    parentElement: HTMLElement;
};
/**
 * Experimental iframe based login.
 * @experimental
 */
export declare class LoginWindowIFrameExperimental implements LoginWindow {
    params: LoginWindowIFrameExperimentalParams;
    private iframe;
    url: URL;
    /**
     * @param url URL
     */
    constructor(params: LoginWindowIFrameExperimentalParams);
    /**
     *
     * @param container loginContainer
     * @returns void
     */
    start(): void;
    /** @returns true if the popup is still open */
    isActive(): boolean;
    /**
     * focuses the popup
     * @returns {void}
     */
    focus(): void;
    /**
     * closes the popup
     * @returns {void}
     */
    close(): void;
    /**
     *
     * @param event event
     * @returns boolean
     */
    isEventSource(event: PopupMessage): boolean;
}
/**
 * Manages a popup window, iframe or redirect.
 * @internal
 */
export default class LoginContainer {
    readonly loginWindow: LoginWindow;
    static readonly containers: {
        [id: string]: LoginContainer;
    };
    private closeListener;
    readonly messageHandlers: MessageHandlers;
    /** */
    constructor(loginWindow: LoginWindow);
    /**
     * @internal
     * @param event event
     * @returns {Promise<void>} void
     */
    onMessage(event: PopupMessage): void;
    /**
     *
     * @param event event
     * @returns boolean
     */
    isMessageFromPopup(event: PopupMessage): boolean;
    /**
     * Runs handlers and removes them.
     * @param handlers handlers
     * @param msg message
     * @param event optional event
     *
     * @returns Promise<void[]>
     */
    private runHandlers;
    /**
     * @param fn handler function
     * @returns void
     */
    onLogin(fn: ClientLoginEventHandler): void;
    /**
     * @param fn handler function
     * @returns void
     */
    onClosed(fn: () => unknown): void;
    /**
     *
     * @param event event
     * @param fn fn
     * @returns void
     */
    once<E extends keyof MessageTypes>(event: E, fn: MessageEventHandler<MessageTypes[E]>): void;
    /**
     *
     * @param event event
     * @param fn fn
     * @param runOnce will detach the event handler after execution if set to true
     * @returns void
     */
    on<E extends keyof MessageTypes>(event: E, fn: MessageEventHandler<MessageTypes[E]>, runOnce?: boolean): void;
    /** @returns true if the login window is still open */
    isActive(): boolean;
    /** @returns void */
    start(): void;
    /**
     * focuses the login window
     * @returns {void}
     */
    focus(): void;
    /**
     * closes the login window
     * @returns {void}
     */
    close(): void;
    /**
     * @returns void
     */
    private deleteFromCache;
    /**
     * @param loginWindow LoginWindow implementation
     *
     * @returns new LoginContainer or focuses an active one with the same id
     */
    static start(loginWindow: LoginWindow): LoginContainer;
}

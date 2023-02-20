import { PopupMessage, PopupWindow } from './popup';
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
export type ClientLoginEventHandler = (msg: LoginResponse, event: MessageEvent) => unknown;
/**
 * Wraps around a popup window (or a redirect in case a popup cannot be opened).
 * @internal
 */
export default class PopupProcess {
    private static processes;
    readonly popup: PopupWindow | null;
    private closeListener;
    readonly messageHandlers: {
        _uno_onLoginInternal: ClientLoginEventHandler[];
        _uno_onLoginClosed: ((msg: {
            success: boolean;
        }) => void)[];
    };
    /** */
    constructor({ url, title, width, height }: PopupParams);
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
     * @param args args
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
     * @returns void
     */
    private deleteFromCache;
    /**
     * @param params see PopupParams
     *
     * @returns new PopupProcess or focuses an active one with the same id
     */
    static start(params: PopupParams): PopupProcess;
}

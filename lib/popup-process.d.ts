declare const oAuthProviders: string[];
export interface LoginOptions {
    userClass: string;
    mode?: 'login' | 'register';
    code?: string;
    authMethod?: typeof oAuthProviders[number];
}
interface PopupParams {
    url: URL;
    title: string;
    width?: number;
    height?: number;
}
export type ClientLoginEventHandler = (msg: {
    success: boolean;
}, event: MessageEvent) => unknown;
/**
 * Wraps around a popup window (or a redirect in case a popup cannot be opened).
 * @internal
 */
export default class PopupProcess {
    readonly popup: Window | null;
    readonly messageHandlers: {
        _uno_onLoginInternal: ClientLoginEventHandler[];
    };
    /** */
    constructor({ url, title, width, height }: PopupParams);
    /**
     * @internal
     * @param event event
     * @returns {Promise<void>} void
     */
    private onMessage;
    /**
     * @param fn handler function
     * @returns void
     */
    onLogin(fn: ClientLoginEventHandler): void;
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
     * @param params see PopupParams
     *
     * @returns new PopupProcess or focuses an active one with the same id
     */
    static start(params: PopupParams): PopupProcess;
}
/**
 * Starts the login process.
 *
 * @param loginOptions containing the userClass
 * @returns void
 */
export declare function startLogin(loginOptions: LoginOptions): Promise<void>;
export {};

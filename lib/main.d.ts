import * as PopupProcess from './popup-process';
import * as options from './options';
export declare const startLogin: typeof PopupProcess.startLogin;
export declare const setup: typeof options.setup;
/**
 * @returns true if the user appears to be logged in.
 * DO NOT USE FOR AUTH
 */
export declare function isLoggedIn(): boolean;
declare const _default: {
    startLogin: typeof PopupProcess.startLogin;
    setup: typeof options.setup;
    isLoggedIn: typeof isLoggedIn;
};
export default _default;

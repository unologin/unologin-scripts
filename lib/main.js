import * as PopupProcess from './popup-process';
import * as options from './options';
export const startLogin = PopupProcess.startLogin;
export const setup = options.setup;
/**
 * @returns true if the user appears to be logged in.
 * DO NOT USE FOR AUTH
 */
export function isLoggedIn() {
    return !!(document.cookie.match(/^(.*;)?\s*_uno_loginState\s*=\s*[^;]+(.*)?$/));
}
export default {
    startLogin: PopupProcess.startLogin,
    setup: options.setup,
    isLoggedIn: isLoggedIn,
};

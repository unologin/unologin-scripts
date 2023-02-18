import { login } from './login';
import * as options from './options';
const loginHandlers = [];
const checkoutHandlers = [];
/**
 * Add callback to execute on successful login.
 *
 * @param fnc callback
 * @returns {void}
 */
export function onLogin(fnc) {
    loginHandlers.push(fnc);
}
/**
 * @hidden
 * @param fnc callback
 * @returns {void}
 */
export function onCheckout(fnc) {
    checkoutHandlers.push(fnc);
}
/**
 * @internal
 * @param {Callback[]} handlers the handlers
 * @param {Error} error optional error
 * @returns {Promise<void>} void
 */
async function runHandlers(handlers, error) {
    return Promise.all(handlers.reverse().map(fn => fn(error)));
}
/**
 * Executes callbacks for login.
 * @internal
 * @param error Error if any.
 * @returns {Promise<void>} void
 */
export async function runLoginHandlers(error) {
    return await runHandlers(loginHandlers, error);
}
/**
 * Executes callbacks for checkout.
 * @param error Error if any.
 * @returns {Promise<void>} void
 */
export async function runCheckoutHandlers(error) {
    return await runHandlers(checkoutHandlers, error);
}
/**
 * Checks query parameters for events
 *
 * @internal
 * @returns {void}
 */
async function checkQuery() {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('_uno_loginSuccess') === 'true';
    const invoiceId = params.get('_uno_invoiceId');
    if (params.get('_uno_loginSuccess')) {
        // fallback has been triggered and we're still in the popup
        if (window.opener) {
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
const messageHandlers = {
    _uno_onLoginInternal: login,
};
/**
 * @internal
 * @param event event
 * @returns {Promise<void>} void
 */
async function onMessage(event) {
    const realm = new URL(options.get().realm);
    if (event.origin === (realm.protocol + '//' + realm.host)) {
        const msg = JSON.parse(event.data);
        if (msg.id in messageHandlers) {
            await messageHandlers[msg.id](msg, event);
        }
    }
}
// some frameworks (like nextjs) will load libraries on the server too
// which causes window to be undefined
if (typeof (window) !== 'undefined') {
    window.addEventListener('load', checkQuery);
    window.addEventListener('message', onMessage);
}

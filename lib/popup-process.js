import { openCenteredPopup } from './popup';
import * as options from './options';
const oAuthProviders = [
    'email',
    'google',
];
// list of all processes that are currently active
const processes = {};
/**
 * Wraps around a popup window (or a redirect in case a popup cannot be opened).
 * @internal
 */
export default class PopupProcess {
    /** */
    constructor({ url, title, width, height }) {
        this.messageHandlers = {
            '_uno_onLoginInternal': [],
        };
        this.popup = openCenteredPopup(url, title, width, height);
        window.addEventListener('message', this.onMessage.bind(this));
    }
    /**
     * @internal
     * @param event event
     * @returns {Promise<void>} void
     */
    onMessage(event) {
        const realm = new URL(options.get().realm);
        if (event.origin === (realm.protocol + '//' + realm.host) &&
            event.source === this.popup) {
            const msg = JSON.parse(event.data);
            const handlers = msg.id in this.messageHandlers ?
                this.messageHandlers[msg.id] :
                null;
            handlers === null || handlers === void 0 ? void 0 : handlers.forEach((fn) => fn(msg, event));
        }
    }
    /**
     * @param fn handler function
     * @returns void
     */
    onLogin(fn) {
        this.messageHandlers._uno_onLoginInternal.push(fn);
    }
    /** @returns true if the popup is still open */
    isActive() {
        return !!(this.popup && !this.popup.closed);
    }
    /**
     * focuses the popup
     * @returns {void}
     */
    focus() {
        var _a;
        // @ts-ignore
        (_a = this.popup) === null || _a === void 0 ? void 0 : _a.focus();
    }
    /**
     * closes the popup
     * @returns {void}
     */
    close() {
        var _a;
        // @ts-ignore
        (_a = this.popup) === null || _a === void 0 ? void 0 : _a.close();
    }
    /**
     * @param params see PopupParams
     *
     * @returns new PopupProcess or focuses an active one with the same id
     */
    static start(params) {
        const id = params.url.href;
        const process = processes[id];
        // if the process is already registered and still running
        if (process && process.isActive()) {
            process.focus();
            return process;
        }
        else {
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
function createUrl(path, query) {
    const url = new URL(path, options.get().realm);
    for (const [k, v] of Object.entries(query)) {
        url.searchParams.set(k, v);
    }
    return url;
}
/**
 * @internal
 * @returns default values for login options
 */
function getDefaultLoginOptions() {
    return {
        client: 'Web',
        appId: options.get().appId,
    };
}
/**
 * Starts the login process.
 *
 * @param loginOptions containing the userClass
 * @returns void
 */
export function startLogin(loginOptions) {
    loginOptions = {
        ...getDefaultLoginOptions(),
        ...loginOptions,
    };
    const loginUrl = createUrl('/', loginOptions);
    let url;
    const provId = loginOptions.authMethod;
    if (provId === 'email' || !provId) {
        url = loginUrl;
    }
    else {
        url = new URL('/initial-auth/' + provId, options.getAPIUrl());
        url.searchParams.set('loginUrl', encodeURIComponent(loginUrl.href));
    }
    const process = PopupProcess.start({
        url,
        title: 'unolog·in',
    });
    return new Promise((resolve, reject) => process.onLogin(({ success }, event) => {
        process.close();
        if (success) {
            resolve();
        }
        else {
            reject(event);
        }
    }));
}

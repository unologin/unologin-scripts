import { openCenteredPopup, } from './popup';
import * as options from './options';
/**
 * Wraps around a popup window (or a redirect in case a popup cannot be opened).
 * @internal
 */
export default class PopupProcess {
    /** */
    constructor({ url, title, width, height }) {
        this.messageHandlers = {
            '_uno_onLoginInternal': [],
            '_uno_onLoginClosed': [],
        };
        this.popup = openCenteredPopup(url, title, width, height);
        window.addEventListener('message', (msg) => this.onMessage(msg));
        this.onClosed(() => clearInterval(this.closeListener));
        this.onClosed(() => this.deleteFromCache());
        this.onLogin(() => clearInterval(this.closeListener));
        this.closeListener = setInterval(() => {
            if (!this.isActive()) {
                this.runHandlers(this.messageHandlers._uno_onLoginClosed, { success: false });
            }
        }, 500);
    }
    /**
     * @internal
     * @param event event
     * @returns {Promise<void>} void
     */
    onMessage(event) {
        if (this.isMessageFromPopup(event)) {
            let msg;
            try {
                msg = JSON.parse(event.data);
            }
            catch (e) {
                throw new Error('Received invalid message: ' + event.data);
            }
            const handlers = msg.id in this.messageHandlers ?
                this.messageHandlers[msg.id] :
                null;
            handlers && this.runHandlers(handlers, msg, event);
        }
    }
    /**
     *
     * @param event event
     * @returns boolean
     */
    isMessageFromPopup(event) {
        const realm = new URL(options.get().realm);
        return (event.origin === (realm.protocol + '//' + realm.host) &&
            event.source === this.popup);
    }
    /**
     * Runs handlers and removes them.
     * @param handlers handlers
     * @param args args
     *
     * @returns Promise<void[]>
     */
    async runHandlers(handlers, ...args) {
        let handler;
        const results = [];
        while (handler = handlers.pop()) {
            results.push(handler(...args));
        }
        return Promise.all(results);
    }
    /**
     * @param fn handler function
     * @returns void
     */
    onLogin(fn) {
        this.messageHandlers._uno_onLoginInternal.push(fn);
    }
    /**
     * @param fn handler function
     * @returns void
     */
    onClosed(fn) {
        this.messageHandlers._uno_onLoginClosed.push(fn);
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
        (_a = this.popup) === null || _a === void 0 ? void 0 : _a.focus();
    }
    /**
     * closes the popup
     * @returns {void}
     */
    close() {
        var _a;
        (_a = this.popup) === null || _a === void 0 ? void 0 : _a.close();
        this.deleteFromCache();
    }
    /**
     * @returns void
     */
    deleteFromCache() {
        const entry = Object.entries(PopupProcess.processes).find(([, p]) => p === this);
        entry && delete PopupProcess.processes[entry[0]];
    }
    /**
     * @param params see PopupParams
     *
     * @returns new PopupProcess or focuses an active one with the same id
     */
    static start(params) {
        const id = params.url.href;
        const process = PopupProcess.processes[id];
        // if the process is already registered and still running
        if (process && process.isActive()) {
            process.focus();
            return process;
        }
        else {
            return PopupProcess.processes[id] = new PopupProcess(params);
        }
    }
}
// list of all processes that are currently active
PopupProcess.processes = {};

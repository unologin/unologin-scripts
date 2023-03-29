"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginWindowPopup = exports.messageIds = void 0;
const popup_js_1 = require("./popup.js");
const options = __importStar(require("./options.js"));
exports.messageIds = {
    '_uno_onLoginInternal': '_uno_onLoginInternal',
    '_uno_onLoginClosed': '_uno_onLoginClosed',
    '_uno_onLoginUrl': '_uno_onLoginUrl',
    '_uno_onResize': '_uno_onResize',
};
/**
 * LoginWindow implementation via popup or redirect.
 */
class LoginWindowPopup {
    /**
     * @param params PopupParams
     */
    constructor(params) {
        this.params = params;
        this.popup = null;
        this.url = params.url;
    }
    /** @returns void */
    start() {
        const { url, title, width, height } = this.params;
        this.popup = (0, popup_js_1.openCenteredPopup)(url, title, width, height);
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
    }
    /**
     *
     * @param event event
     * @returns boolean
     */
    isEventSource(event) {
        return event.source === this.popup;
    }
}
exports.LoginWindowPopup = LoginWindowPopup;
/**
 * Manages a popup window, iframe or redirect.
 * @internal
 */
class LoginContainer {
    /** */
    constructor(loginWindow) {
        this.loginWindow = loginWindow;
        this.messageHandlers = {
            '_uno_onLoginInternal': [],
            '_uno_onLoginClosed': [],
            '_uno_onResize': [],
            '_uno_onLoginUrl': [],
        };
        if (typeof (window) !== 'undefined') {
            window.addEventListener('message', (msg) => this.onMessage(msg));
        }
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
            this.loginWindow.isEventSource(event));
    }
    /**
     * Runs handlers and removes them.
     * @param handlers handlers
     * @param msg message
     * @param event optional event
     *
     * @returns Promise<void[]>
     */
    runHandlers(handlers, msg, event) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(handlers
                .filter((handler) => ((handler.n++) == 0 || !handler.runOnce))
                .map((handler) => handler(msg, event)));
        });
    }
    /**
     * @param fn handler function
     * @returns void
     */
    onLogin(fn) {
        return this.once('_uno_onLoginInternal', fn);
    }
    /**
     * @param fn handler function
     * @returns void
     */
    onClosed(fn) {
        return this.once('_uno_onLoginClosed', fn);
    }
    /**
     *
     * @param event event
     * @param fn fn
     * @returns void
     */
    once(event, fn) {
        return this.on(event, fn, true);
    }
    /**
     *
     * @param event event
     * @param fn fn
     * @param runOnce will detach the event handler after execution if set to true
     * @returns void
     */
    on(event, fn, runOnce = false) {
        this.messageHandlers[event].push(Object.assign(fn, Object.assign({ runOnce, n: 0 }, fn)));
    }
    /** @returns true if the login window is still open */
    isActive() {
        return this.loginWindow.isActive();
    }
    /** @returns void */
    start() {
        var _a, _b;
        (_b = (_a = this.loginWindow).start) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    /**
     * focuses the login window
     * @returns {void}
     */
    focus() {
        this.loginWindow.focus();
    }
    /**
     * closes the login window
     * @returns {void}
     */
    close() {
        this.loginWindow.close();
        this.deleteFromCache();
    }
    /**
     * @returns void
     */
    deleteFromCache() {
        const entry = Object.entries(LoginContainer.containers).find(([, p]) => p === this);
        entry && delete LoginContainer.containers[entry[0]];
    }
    /**
     * @param loginWindow LoginWindow implementation
     *
     * @returns new LoginContainer or focuses an active one with the same id
     */
    static start(loginWindow) {
        const id = loginWindow.url.href;
        let process = LoginContainer.containers[id];
        // if the process is already registered and still running
        if (process && process.isActive()) {
            process.focus();
            return process;
        }
        else {
            process = LoginContainer.containers[id] = new LoginContainer(loginWindow);
            process.start();
            return process;
        }
    }
}
exports.default = LoginContainer;
LoginContainer.containers = {};

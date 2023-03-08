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
const popup_js_1 = require("./popup.js");
const options = __importStar(require("./options.js"));
/**
 * Wraps around a popup window (or a redirect in case a popup cannot be opened).
 * @internal
 */
class PopupProcess {
    /** */
    constructor({ url, title, width, height }) {
        this.messageHandlers = {
            '_uno_onLoginInternal': [],
            '_uno_onLoginClosed': [],
        };
        this.popup = (0, popup_js_1.openCenteredPopup)(url, title, width, height);
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
            event.source === this.popup);
    }
    /**
     * Runs handlers and removes them.
     * @param handlers handlers
     * @param args args
     *
     * @returns Promise<void[]>
     */
    runHandlers(handlers, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let handler;
            const results = [];
            while (handler = handlers.pop()) {
                results.push(handler(...args));
            }
            return Promise.all(results);
        });
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
exports.default = PopupProcess;
// list of all processes that are currently active
PopupProcess.processes = {};

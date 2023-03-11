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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.isLoggedIn = exports.awaitLoginContainer = exports.startLoginContainer = exports.startLogin = exports.LoginWindowPopup = exports.LoginContainer = exports.LoginFlowError = void 0;
const options = __importStar(require("./options.js"));
const login = __importStar(require("./login.js"));
const loginContainer = __importStar(require("./login-container"));
exports.LoginFlowError = login.LoginFlowError;
exports.LoginContainer = loginContainer.default;
exports.LoginWindowPopup = loginContainer.LoginWindowPopup;
exports.startLogin = login.startLogin;
exports.startLoginContainer = login.startLoginContainer;
exports.awaitLoginContainer = login.awaitLoginContainer;
exports.isLoggedIn = login.isLoggedIn;
exports.setup = options.setup;
exports.default = {
    LoginFlowError: exports.LoginFlowError,
    startLogin: exports.startLogin,
    startLoginContainer: exports.startLoginContainer,
    awaitLoginContainer: exports.awaitLoginContainer,
    isLoggedIn: exports.isLoggedIn,
    setup: exports.setup,
    LoginContainer: exports.LoginContainer,
    LoginWindowPopup: exports.LoginWindowPopup,
};

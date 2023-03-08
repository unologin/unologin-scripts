"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.setup = void 0;
const defaultOptions = {
    realm: 'https://login.unolog.in',
};
// app settings
let options = null;
/**
 * API url for current realm
 * @param realm realm URL
 * @returns {string} API URL
 */
function getAPIUrlFromRealm(realm) {
    if (realm.startsWith('https://login')) {
        return realm.replace('https://login', 'https://api');
    }
    else {
        throw Error('Invalid configuration! Missing "api" in options.');
    }
}
/**
 * Allows setting appId and realm.
 *
 * @param params appId and realm
 *
 * @returns void
 */
function setup(params) {
    const api = params.api ||
        getAPIUrlFromRealm(params.realm || defaultOptions.realm);
    options = Object.assign(Object.assign(Object.assign({}, defaultOptions), params), { api });
}
exports.setup = setup;
/** @returns options */
function get() {
    if (options) {
        return options;
    }
    else {
        throw new Error('Please call setup(...) before using the library.');
    }
}
exports.get = get;

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
export function setup(params) {
    const api = params.api ||
        getAPIUrlFromRealm(params.realm || defaultOptions.realm);
    options =
        {
            ...defaultOptions,
            ...params,
            api,
        };
}
/** @returns options */
export function get() {
    if (options) {
        return options;
    }
    else {
        throw new Error('Please call setup(...) before using the library.');
    }
}

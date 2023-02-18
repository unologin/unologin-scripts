// app settings
let options = null;
/**
 * @returns API url for current realm
 */
export function getAPIUrl() {
    const realm = get().realm;
    if (realm.startsWith('https://login')) {
        return realm.replace('https://login', 'https://api');
    }
    else {
        const apiUrl = get().api;
        if (apiUrl) {
            return apiUrl;
        }
        else {
            throw Error('Invalid configuration! Missing "api" in options.');
        }
    }
}
/**
 * Allows setting appId and realm.
 *
 * @param params appId and realm
 *
 * @returns void
 */
export function setup({ appId, realm }) {
    options =
        {
            realm: realm || 'https://login.unolog.in',
            appId,
        };
}
/** @returns options */
export function get() {
    if (!options) {
        throw new Error('Please call setup(...) before using the library.');
    }
    return options;
}

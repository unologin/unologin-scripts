export interface Options {
    /**
     * Your appId.
     */
    appId: string;
    /**
     * Which base URL to use for the login flow.
     * Defaults to https://login.unolog.in
     */
    realm: string;
    /**
     * Optional API URL the frontend is using.
     * May be inferred from realm.
     */
    api: string;
    /**
     * Optional callback URL.
     * Defaults to the first URL in the whitelist configured
     * on the dashboard.
     */
    callbackUrl?: URL | string;
}
/**
 * Allows setting appId and realm.
 *
 * @param params appId and realm
 *
 * @returns void
 */
export declare function setup(params: Pick<Options, 'appId'> & Partial<Options>): void;
/** @returns options */
export declare function get(): Options;

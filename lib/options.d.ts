export interface SetupParams {
    realm?: string;
    api?: string;
    appId: string;
}
interface Setup extends SetupParams {
    realm: string;
}
/**
 * @returns API url for current realm
 */
export declare function getAPIUrl(): string;
/**
 * Allows setting appId and realm.
 *
 * @param params appId and realm
 *
 * @returns void
 */
export declare function setup({ appId, realm }: SetupParams): void;
/** @returns options */
export declare function get(): Setup;
export {};

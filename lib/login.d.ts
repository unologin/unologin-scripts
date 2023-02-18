interface LoginMessage {
    success: boolean;
    invoiceId?: string | null;
}
/**
 *
 * @param param0 see LoginMessage
 * @returns {Promise<void>} void
 */
export declare function login({ success, invoiceId }: LoginMessage): Promise<void>;
export {};

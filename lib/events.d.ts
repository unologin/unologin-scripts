type Callback = (error?: Error) => void | Promise<void>;
/**
 * Add callback to execute on successful login.
 *
 * @param fnc callback
 * @returns {void}
 */
export declare function onLogin(fnc: Callback): void;
/**
 * @hidden
 * @param fnc callback
 * @returns {void}
 */
export declare function onCheckout(fnc: Callback): void;
/**
 * Executes callbacks for login.
 * @internal
 * @param error Error if any.
 * @returns {Promise<void>} void
 */
export declare function runLoginHandlers(error?: Error): Promise<void[]>;
/**
 * Executes callbacks for checkout.
 * @param error Error if any.
 * @returns {Promise<void>} void
 */
export declare function runCheckoutHandlers(error?: Error): Promise<void[]>;
export {};

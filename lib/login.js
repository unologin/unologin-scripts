import { runLoginHandlers } from './events';
import { startCheckout } from './popup-process';
/**
 *
 * @param param0 see LoginMessage
 * @returns {Promise<void>} void
 */
export async function login({ success, invoiceId }) {
    // store the temporary login token
    if (success) {
        await runLoginHandlers();
    }
    else {
        await runLoginHandlers(new Error('login failed'));
    }
    // if there is an invoice to pay for
    if (invoiceId) {
        startCheckout(invoiceId);
    }
}

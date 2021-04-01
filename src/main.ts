
import * as PopupProcess from './popup-process';
import * as options from './options';
import * as events from './events';

export const startCheckout = PopupProcess.startCheckout;
export const startLogin = PopupProcess.startLogin;
export const setup = options.setup;
export const onLogin = events.onLogin;
export const onCheckout = events.onCheckout;

/**
 * @returns true if the user appears to be logged in.
 * DO NOT USE FOR AUTH
 */
export function isLoggedIn() : boolean
{
  return !!(
    document.cookie.match(/^(.*;)?\s*_uno_loginState\s*=\s*[^;]+(.*)?$/)
  );
}

export default 
{
  startCheckout: PopupProcess.startCheckout,
  startLogin: PopupProcess.startLogin,
  setup: options.setup,
  onLogin: events.onLogin,
  onCheckout: events.onCheckout,
  isLoggedIn: isLoggedIn,
};

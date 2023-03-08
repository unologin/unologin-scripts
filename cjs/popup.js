"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openCenteredPopup = void 0;
/**
 * Opens a centered popup or redirects the user.
 *
 * @param url target url
 * @param title title of the popup window
 * @param width width
 * @param height height
 *
 * @returns {Window} popup
 */
function openCenteredPopup(url, title, width = 370, height = 562) {
    if (typeof (window) === 'undefined') {
        return null;
    }
    const top = window.top || window.parent || window;
    const y = top.outerHeight / 2 + top.screenY - (height / 2);
    const x = top.outerWidth / 2 + top.screenX - (width / 2);
    const popup = window.open(url.href, title, 
    // eslint-disable-next-line max-len
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${y}, left=${x}`);
    if (popup) {
        popup.focus();
        return popup;
    }
    else {
        // fall back to a redirect
        window.location.href = url.href;
        return null;
    }
}
exports.openCenteredPopup = openCenteredPopup;

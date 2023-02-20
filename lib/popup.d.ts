export type PopupWindow = Pick<Window, 'closed' | 'close' | 'focus'>;
export type PopupMessage = Pick<MessageEvent, 'origin' | 'data'> & {
    source: PopupWindow | MessageEventSource | null;
};
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
export declare function openCenteredPopup(url: URL, title: string, width?: number, height?: number): PopupWindow | null;

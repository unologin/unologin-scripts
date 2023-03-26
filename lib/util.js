/**
 *
 * @param o object
 * @returns new object with only entries from o which are not "undefined"
 */
export function removeUndefined(o) {
    return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUndefined = void 0;
/**
 *
 * @param o object
 * @returns new object with only entries from o which are not "undefined"
 */
function removeUndefined(o) {
    return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
}
exports.removeUndefined = removeUndefined;

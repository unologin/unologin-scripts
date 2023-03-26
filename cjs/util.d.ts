/**
 *
 * @param o object
 * @returns new object with only entries from o which are not "undefined"
 */
export declare function removeUndefined<T extends object>(o: T): Partial<T>;

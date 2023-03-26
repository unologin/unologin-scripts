
/**
 * 
 * @param o object
 * @returns new object with only entries from o which are not "undefined"
 */
export function removeUndefined<
  T extends object
>(o : T) : Partial<T>
{
  return Object.fromEntries(
    Object.entries(o).filter(
      ([, v]) => v !== undefined,
    ),
  ) as Partial<T>;
}

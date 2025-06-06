/**
 * Divides a list into two sublists at the specified index, with optional skipping of the split item.
 *
 * @typeParam T - The type of items in the array.
 * @param lists - The input array to divide.
 * @param standard - The index at which to split the array.
 * @param skipMiddle - If true, the item at `standard` index will be excluded from both sublists.
 * @returns An object with `left` containing elements before `standard`, and `right` containing elements from `standard` (or `standard + 1` if skipped) to the end.
 *
 * @example
 * ```ts
 * divideListsIntoHalf({ lists: [1, 2, 3, 4], standard: 2 });
 * // => { left: [1, 2], right: [3, 4] }
 *
 * divideListsIntoHalf({ lists: [1, 2, 3, 4], standard: 2, skipMiddle: true });
 * // => { left: [1, 2], right: [4] }
 * ```
 */
export function divideListsIntoHalf<T>({
  lists,
  standard,
  skipMiddle = false,
}: {
  lists: Array<T>;
  standard: number;
  skipMiddle?: boolean;
}) {
  return {
    left: lists.slice(0, standard),
    right: lists.slice(skipMiddle ? standard + 1 : standard),
  };
}

/**
 * Returns a shallow slice of an array from `startIndex` (inclusive) to `destIndex` (exclusive).
 *
 * @typeParam T - The type of items in the array.
 * @param lists - The array to slice.
 * @param startIndex - The starting index (inclusive). Defaults to `0`.
 * @param destIndex - The ending index (exclusive).
 * @returns A new array containing elements from `startIndex` up to but not including `destIndex`.
 *
 * @example
 * ```ts
 * const result = getSubListsOfOrigin({
 *   lists: [10, 20, 30, 40],
 *   startIndex: 1,
 *   destIndex: 3,
 * });
 * // result = [20, 30]
 * ```
 */
export function getSubListsOfOrigin<T>({
  lists,
  startIndex = 0,
  destIndex,
}: {
  lists: Array<T>;
  startIndex?: number;
  destIndex: number;
}) {
  return lists.slice(startIndex, destIndex);
}

/**
 * Inserts one or more elements into an array at a specified index,
 * optionally replacing existing elements.
 *
 * If `elementsToInsert` is a single value, it will be converted to an array.
 *
 * @typeParam T - The type of elements in the array.
 * @param baseLists - The original array to modify.
 * @param indexToInsert - The index at which to insert the new elements.
 * @param deleteCount - The number of elements to remove at the insertion point. Defaults to `1`.
 * @param elementsToInsert - A single element or array of elements to insert.
 * @returns The modified array with the new elements inserted.
 *
 * @example
 * ```ts
 * const result = insertElementInLists({
 *   baseLists: [1, 2, 5],
 *   indexToInsert: 2,
 *   elementsToInsert: [3, 4],
 * });
 * // result = [1, 2, 3, 4]
 * ```
 *
 * @example
 * ```ts
 * const result = insertElementInLists({
 *   baseLists: ['a', 'b', 'd'],
 *   indexToInsert: 2,
 *   elementsToInsert: 'c',
 * });
 * // result = ['a', 'b', 'c']
 * ```
 */
export function insertElementInLists<T>({
  baseLists,
  indexToInsert,
  deleteCount = 1,
  elementsToInsert,
}: {
  baseLists: Array<T>;
  indexToInsert: number;
  deleteCount?: number;
  elementsToInsert: Array<T> | T;
}) {
  const elements = Array.isArray(elementsToInsert)
    ? elementsToInsert
    : [elementsToInsert];

  baseLists.splice(indexToInsert, deleteCount, ...elements);
  return baseLists;
}

export function deleteElementInLists<T>({
  baseLists,
  targetValue,
}: {
  baseLists: Array<T>;
  targetValue: T;
}) {
  return baseLists.filter((element) => targetValue !== element);
}

export function findTargetIndexInLists<T>(baseLists: Array<T>, targetValue: T) {
  const index = baseLists?.findIndex((element) => targetValue === element);

  return index === -1 ? null : index;
}

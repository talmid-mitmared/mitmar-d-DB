import { PageCore } from './b-tree/Pages';
import {
  findIndexToInsertKey,
  getNextChildIndexForTraverse,
} from './index-utils';
import { divideListsIntoHalf } from './b-tree/utils/array';

export function insert(
  page: PageCore,
  queryKey: number,
  parentPage?: PageCore,
) {
  const hasParentPage = parentPage != null;

  if (
    /**
     * Inserts the key only if the current node is a leaf (i.e., has no children).
     * If the node isn't full, the key is inserted directly without needing a split.
     */
    page.isPageOverflows() === false &&
    page.isPageLeaf()
  ) {
    const indexToInsert = findIndexToInsertKey(page, queryKey);

    page.insertKey(indexToInsert, queryKey);

    return page;
  }

  if (
    /**
     * The page is full and a parent node exists — we must promote a key to the parent,
     * so a split operation is required.
     */
    page.isPageOverflows() &&
    hasParentPage
  ) {
    const { primaryKey, leftPage, rightPage } = splitPageIntoTwoPairs(page);

    const childIndexToInsert = getNextChildIndexForTraverse(
      parentPage,
      primaryKey,
    );

    const childrenToInsert = [leftPage, rightPage];

    parentPage.insertChildren(childIndexToInsert, childrenToInsert);

    const keyIndexToInsert = findIndexToInsertKey(page, queryKey);

    parentPage.insertKey(keyIndexToInsert, primaryKey);

    const currentPageIndex = getNextChildIndexForTraverse(parentPage, queryKey);

    if (currentPageIndex == null) return;

    insert(parentPage.children[currentPageIndex], queryKey, page);

    return;
  }

  const childIndex = getNextChildIndexForTraverse(page, queryKey);

  if (childIndex == null) return;

  insert(page.children[childIndex], queryKey, page);
}

/**
 * Splits a full page node into two child pages and promotes the middle key.
 *
 * This function is typically called when a B-Tree node overflows due to insertion.
 * It finds the middle key to promote, divides the keys and children into two groups,
 * and returns the left and right pages plus the promoted key.
 *
 * @typeParam T - The type of keys in the B-Tree.
 * @param page - The page to split. It must be full and require splitting.
 * @returns An object containing the `leftPage`, `rightPage`, and the `primaryKey` to be promoted.
 *
 * @example
 * ```ts
 * const { leftPage, rightPage, primaryKey } = splitPageIntoTwoPairs(fullPage);
 * root.insertPromotedKey(primaryKey, leftPage, rightPage);
 * ```
 */
export function splitPageIntoTwoPairs(page: PageCore) {
  const indexOfPrimaryKey = page.indexOfPrimaryKey();
  const primaryKey = page.recordKeys[indexOfPrimaryKey];

  /**
   * Children are split corresponding to the key split.
   * Left children < primaryKey, right children >= primaryKey.
   */
  const { left: leftChildren, right: rightChildren } = divideListsIntoHalf({
    lists: page.children,
    standard: page.minimumDegree,
  });

  /**
   * Split keys and skip the promoted middle key from both pages.
   */
  const { left: leftKeys, right: rightKeys } = divideListsIntoHalf({
    lists: page.recordKeys,
    standard: indexOfPrimaryKey,
    skipMiddle: true,
  });

  const leftPage = new PageCore(page.minimumDegree, leftKeys, leftChildren);
  const rightPage = new PageCore(page.minimumDegree, rightKeys, rightChildren);

  return {
    leftPage,
    rightPage,
    primaryKey,
  };
}

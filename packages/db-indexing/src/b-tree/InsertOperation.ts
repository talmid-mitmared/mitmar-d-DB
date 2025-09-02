import { divideListsIntoHalf, insertElementInLists } from '../utils/array';
import {
  $BtPage,
  createBtreePage,
  getIndexOfPrimaryKey,
  isAbleToInsert,
  isPageOverflows,
} from './Page';
import { searchInPage } from './SearchOperation';

/**
 * Recursive B-tree insert operation with self-balancing guarantees.
 *
 * Handles four primary cases:
 * 1. Key exists → no-op
 * 2. Leaf node with space → direct insert
 * 3. Overflow → split and propagate
 * 4. Internal node → descend to appropriate child
 *
 */
export function insertInTree(page: $BtPage, queryKey: number, parentPage?: $BtPage): $BtPage {
  const result = searchInPage(page, queryKey);

  // Case 1: Early exit if key already exists in the current node
  if (result.value === queryKey) return page;

  // Case 2: Leaf node with available space → perform direct insert
  if (isAbleToInsert(page)) {
    return insertInPage(page, queryKey);
  }

  // Case 3: Overflow detected → split the page and promote median to parent
  if (isPageOverflows(page)) {
    const newParentPage = propagation(page, queryKey, parentPage);

    const { index: currentIndex, end, value } = searchInPage(newParentPage, queryKey);

    if (end && value === queryKey) return newParentPage;

    // Recurse into the appropriate child subtree created during split
    insertInTree(newParentPage.children[currentIndex as number], queryKey, newParentPage);

    return newParentPage;
  }

  // Case 4: Internal node → traverse down to correct child
  const { index: childrenIndex, end, value } = searchInPage(page, queryKey);

  if (end && value === queryKey) return page;

  insertInTree(page.children[childrenIndex as number], queryKey, page);

  return page;
}

/**
 * Splits a full page and promotes its median key to the parent.
 *
 * This function guarantees that after the operation:
 * - The tree remains height-balanced.
 * - The promoted key is correctly inserted into the parent.
 * - The overflowing page is replaced by two balanced siblings.
 *
 */
export function propagation(page: $BtPage, queryKey: number, parentPage?: $BtPage): $BtPage {
  const { primaryKey, children: newChildren } = splitPageIntoHalf(page);

  // Case: Root node split → new root must be created
  if (parentPage == null) {
    return createBtreePage({
      minimumDegree: page.minimumDegree,
      recordKeys: [primaryKey],
      children: newChildren,
    });
  }
  // Case: Insert promoted key into existing parent
  const newParentPage = insertInPage(parentPage, primaryKey);
  const { index } = searchInPage(newParentPage, primaryKey);

  const updatedChildren = insertElementInLists({
    baseLists: newParentPage.children,
    indexToInsert: index as number,
    elementsToInsert: newChildren,
  });

  return createBtreePage({
    minimumDegree: newParentPage.minimumDegree,
    recordKeys: newParentPage.recordKeys,
    children: updatedChildren,
  });
}

/**
 * @todo This is a "raw insert" — add structural validation or move to safer builder pattern.
 */
export function insertInPage(page: $BtPage, queryKey: number): $BtPage {
  page.recordKeys.push(queryKey);
  page.recordKeys.sort((a, b) => a - b);

  return page;
}

/**
 * Splits a page into two balanced halves, returning:
 * - The promoted (median) key
 * - The new left and right sibling pages
 *
 * Preserves ordering and structure necessary for B-tree rebalancing.
 */
export function splitPageIntoHalf(page: $BtPage) {
  const primaryIndex = getIndexOfPrimaryKey(page);
  const primaryKey = page.recordKeys[primaryIndex];

  // Divide children evenly around the split point
  const { left: leftChildren, right: rightChildren } = divideListsIntoHalf({
    lists: page.children,
    standard: page.minimumDegree,
  });

  // Divide keys while skipping the promoted median
  const { left: leftKeys, right: rightKeys } = divideListsIntoHalf({
    lists: page.recordKeys,
    standard: primaryIndex,
    skipMiddle: true,
  });

  const leftPage = createBtreePage({
    minimumDegree: page.minimumDegree,
    recordKeys: leftKeys,
    children: leftChildren,
  });

  const rightPage = createBtreePage({
    minimumDegree: page.minimumDegree,
    recordKeys: rightKeys,
    children: rightChildren,
  });

  return {
    primaryIndex,
    children: [leftPage, rightPage],
    primaryKey,
  };
}

/**
 * Copyright (c) 2025 resetmerlin
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @tsdoc
 */

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
 * Top-level B-tree insert function (recursive).
 *
 * Handles four primary cases:
 * 1. Key already exists → no-op
 * 2. Leaf with space → insert directly
 * 3. Page overflow → split page and propagate up
 * 4. Internal node → delegate to child
 *
 * @param page - Current page (root or subtree) being examined.
 * @param queryKey - Key to be inserted.
 * @param parentPage - Optional parent reference for recursive propagation.
 * @returns New root page if tree grows at root; otherwise, original page reference.
 */
export function insertInTree(
  page: $BtPage,
  queryKey: number,
  parentPage?: $BtPage,
): $BtPage {
  const result = searchInPage(page, queryKey);

  // Case 1: Key already exists — return early
  if (result.value === queryKey) return page;

  // Case 2: Leaf with room — insert directly
  if (isAbleToInsert(page)) {
    return insertInPage(page, queryKey);
  }
  // Case 3: Overflow at current page — must split and propagate up
  if (isPageOverflows(page)) {
    const newParentPage = propagation(page, queryKey, parentPage);

    const { index: currentIndex, end } = searchInPage(newParentPage, queryKey);

    if (end) return newParentPage;

    // Recurse into the new subtree created during propagation
    insertInTree(
      newParentPage.children[currentIndex as number],
      queryKey,
      newParentPage,
    );

    return newParentPage;
  }

  // Case 4: Internal node — delegate to appropriate child
  const { index: childrenIndex, end } = searchInPage(page, queryKey);

  if (end) return page;

  insertInTree(page.children[childrenIndex as number], queryKey, page);

  return page;
}

/**
 * Handles page splitting and parent propagation when a page overflows.
 *
 * This is the core logic that ensures B-tree balance by:
 * - Promoting the median key upward.
 * - Splitting the overflowing page into left/right siblings.
 *
 * If the root is split, a new root is created.
 *
 * @param page - Overflowing page to split.
 * @param parentPage - Parent to insert median key into (optional).
 * @returns New parent page (may be a new root).
 */
export function propagation(
  page: $BtPage,
  queryKey: number,
  parentPage?: $BtPage,
): $BtPage {
  const { primaryKey, children: newChildren } = splitPageIntoHalf(page);

  // Root split — create a new root node
  if (parentPage == null) {
    return createBtreePage({
      minimumDegree: page.minimumDegree,
      recordKeys: [primaryKey],
      children: newChildren,
    });
  }

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
 * Inserts a key into a page and sorts keys afterward.
 *
 * This function assumes the page is a leaf and has capacity.
 * No structural validation is done here.
 *
 * @todo: Need to put validation logic also, not pure.... ㅜㅜ
 */
export function insertInPage(page: $BtPage, queryKey: number): $BtPage {
  page.recordKeys.push(queryKey);
  page.recordKeys.sort((a, b) => a - b);

  return page;
}

/**
 * Splits a page into two halves, returning promoted key and new children.
 *
 * The median key is selected as the primary key to be pushed up.
 * Children and recordKeys are divided around the median.
 *
 * @param page - Page to split.
 * @returns Object containing:
 *  - `primaryKey`: the key to promote
 *  - `children`: [leftPage, rightPage]
 *  - `primaryIndex`: original index of the median key
 */
export function splitPageIntoHalf(page: $BtPage) {
  const primaryIndex = getIndexOfPrimaryKey(page);
  const primaryKey = page.recordKeys[primaryIndex];

  const { left: leftChildren, right: rightChildren } = divideListsIntoHalf({
    lists: page.children,
    standard: primaryIndex,
  });

  const { left: leftKeys, right: rightKeys } = divideListsIntoHalf({
    lists: page.recordKeys,
    standard: primaryIndex,
    skipMiddle: true, // Skip median when slicing record keys
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

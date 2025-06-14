/**
 * Copyright (c) 2025 resetmerlin
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @tsdoc
 */
import { getIterator } from '../Iterator';
import { $IteratorNode } from '../IteratorNode';
import { $BtPage, RecordKey } from './Page';
import { findTargetIndexInLists } from '../utils/array';
import { getNextPageIndex } from '../utils/page';

/**
 * Full recursive search over a B-tree structure.
 *
 * Traverses from root to leaf in search of `queryKey`.
 *
 * @param page - Current B-tree page (node)
 * @param queryKey - Key to find
 * @returns Matching key value (if found), else `null`
 */
export function searchInTree(
  page: $BtPage,
  queryKey: RecordKey,
): number | null {
  const { index, value, end } = searchInPage(page, queryKey);

  // Case 1: Match found at current level — return early
  if (value === queryKey) {
    return value;
  }

  // Case 2: Reached leaf node (no children left to search)
  if (end) return null;

  // Case 3: Recurse into selected child node
  const nextPage = page.children[index ?? -1];
  if (nextPage == null) return null;

  return searchInTree(nextPage, queryKey);
}

/**
 * One-level search at a specific B-tree page.
 *
 * Designed for compatibility with both full-tree and shallow search.
 * Delegates actual comparison to `searchInIterator` strategy.
 *
 * @param page - B-tree page to inspect
 * @param queryKey - Key to locate
 * @returns Object with:
 *  - `index`: position to use for traversal or match
 *  - `value`: matching key (or null)
 *  - `end`: true if no children to descend into
 */
export function searchInPage(page: $BtPage, queryKey: RecordKey) {
  const searchFn = searchInIterator(page, queryKey);
  const iterator = getIterator(searchFn);

  iterator.next();

  return {
    index: iterator.current(),
    value: iterator.value(),
    end: iterator.end(),
  };
}

/**
 * Builds an iterator-compatible search function for B-tree traversal.
 *
 * Updates the `$IteratorNode` in-place with search results:
 * - On match: sets `index` and `value`.
 * - On miss: calculates the next child index, marks end if at leaf.
 *
 * @param page - Current B-tree page
 * @param queryKey - Key to find
 * @returns A search function used by the TreeIterator
 */
export function searchInIterator(page: $BtPage, queryKey: RecordKey) {
  return function (node: $IteratorNode) {
    const targetIndex = findTargetIndexInLists(page.recordKeys, queryKey);

    // Exact match found
    if (targetIndex != null) {
      node.index = targetIndex;
      node.value = page.recordKeys[targetIndex] as number;
      return node;
    }

    // Compute next child index for traversal
    const nextIndex = getNextPageIndex(page.recordKeys, queryKey);
    node.index = nextIndex;

    // No further children available — mark as terminal node
    if (page.children[nextIndex] == null) {
      node.last = true;
    }

    return node;
  };
}

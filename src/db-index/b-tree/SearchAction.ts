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
 * Recursively searches for the target key in a B-tree-like structure.
 *
 * This is a full traversal algorithm that descends through children
 * until a matching key is found or a terminal leaf is reached.
 *
 */
export function searchAll(page: $BtPage, queryKey: RecordKey): number | null {
  const { index, value, end } = search(page, queryKey);

  // Match found in current page — early return.
  if (value === queryKey) {
    return value;
  }

  // If reaches end;no children
  if (end) return null;

  // Descend into the appropriate child page.
  const nextPage = page.children[index ?? -1];

  // Reached a leaf node or invalid child reference.
  if (nextPage == null) return null;

  return searchAll(nextPage, queryKey);
}

/**
 * One-shot search for the target key at a single tree level.
 * Does not recurse — useful for shallow scans or root-only lookups.
 */
export function search(page: $BtPage, queryKey: RecordKey) {
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
 * Builds a `search` function compatible with the `TreeIterator`.
 *
 * Mutates the iterator node (`this`) to reflect the search result:
 * - If the key exists, sets `.index` and `.value`.
 * - Otherwise, computes the appropriate child index to descend into.
 */
export function searchInIterator(page: $BtPage, queryKey: RecordKey) {
  return function (node: $IteratorNode) {
    const targetIndex = findTargetIndexInLists(page.recordKeys, queryKey);

    // Exact match found in the current page.
    if (targetIndex != null) {
      node.index = targetIndex;
      node.value = page.recordKeys[targetIndex] as number;
      return node;
    }

    // Key not found — calculate which child to follow.
    const nextIndex = getNextPageIndex(page.recordKeys, queryKey);

    node.index = nextIndex;

    if (page.children[nextIndex] == null) {
      node.last = true;
    }

    return node;
  };
}

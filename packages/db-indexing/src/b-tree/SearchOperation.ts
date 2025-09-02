import { getIterator } from '../Iterator';
import { $IteratorNode } from '../IteratorNode';
import { $BtPage, RecordKey } from './Page';
import { findTargetIndexInLists } from '../utils/array';
import { getNextPageIndex } from '../utils/page';

export function searchInTree(page: $BtPage, queryKey: RecordKey): number | null {
  const { index, value, end } = searchInPage(page, queryKey);

  // Case 1: Match found at current level — return early
  if (value === queryKey) {
    return value;
  }

  // Case 2: Reached leaf node (no children left to search)
  if (end && value === queryKey) return value;

  // Case 3: Recurse into selected child node
  const nextPage = page.children[index ?? -1];
  if (nextPage == null) return null;

  return searchInTree(nextPage, queryKey);
}

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

export function searchInIterator(page: $BtPage, queryKey: RecordKey) {
  return function (node: $IteratorNode) {
    const targetIndex = findTargetIndexInLists(page.recordKeys, queryKey);

    // No further children available — mark as terminal node
    if (page.children.length === 0) {
      node.last = true;
    }

    // Exact match found
    if (targetIndex != null) {
      node.index = targetIndex;
      node.value = page.recordKeys[targetIndex] as number;
      return node;
    }

    // Compute next child index for traversal
    const nextIndex = getNextPageIndex(page.recordKeys, queryKey);
    node.index = nextIndex;

    return node;
  };
}

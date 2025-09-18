import { getIterator } from '../Iterator';
import { $IteratorNode } from '../IteratorNode';
import { $BtPage, RecordKey } from './Page';
import { findTargetIndexInLists } from '../utils/array';
import { getNextPageIndex } from '../utils/page';

export function searchInTree(page: $BtPage, queryKey: RecordKey) {
  let parentStack: $BtPage[] = [];
  let current = page;
  let found = false;

  do {
    const { index, value, end } = searchInPage(current, queryKey);

    if (value == null) {
      if (end || index == null) break;

      parentStack.push(current);

      current = current.children[index];
    }

    if (value != null) {
      found = true;
    }
  } while (!found);

  return {
    currentPage: found ? current : null,
    parentPage: parentStack.pop() ?? null,
    isQueryKeyExists: found,
  };
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

function searchInIterator(page: $BtPage, queryKey: RecordKey) {
  return function (node: $IteratorNode) {
    const targetIndex = findTargetIndexInLists(page.recordKeys, queryKey);

    if (page.children.length === 0) {
      node.last = true;
    }

    if (targetIndex != null) {
      node.index = targetIndex;
      node.value = page.recordKeys[targetIndex];
      return node;
    }

    const nextIndex = getNextPageIndex(page.recordKeys, queryKey);
    node.index = nextIndex;

    return node;
  };
}

import { $BtPage, createBtreePage, isAbleToInsert, isPageOverflows } from '../Page';
import { searchInPage } from '../SearchOperation';
import { propagate } from './propagate';

/**
 * @todo This is a "raw insert" — add structural validation or move to safer builder pattern.
 */
export function insertInPage(page: $BtPage, queryKey: number): $BtPage {
  page.recordKeys.push(queryKey);
  page.recordKeys.sort((a, b) => a - b);

  return createBtreePage({
    ...page,
  });
}

export function insertInTree(page: $BtPage, queryKey: number) {
  let returnStack: { page: $BtPage; childIndex: number }[] = [];

  let current = page;
  let inserted = false;
  let unbalanced = false;
  let propagated = false;

  const reReference = (newPage: $BtPage) => {
    const parentTree = returnStack.pop();

    const isNotRoot = parentTree != null;

    if (isNotRoot) {
      parentTree.page.children[parentTree.childIndex] = newPage;
      returnStack.push(parentTree);
      current = newPage;

      return;
    }

    const { index: currentIndex } = searchInPage(newPage, queryKey);

    returnStack.push({ page: newPage, childIndex: currentIndex == null ? 0 : currentIndex });

    if (currentIndex != null) current = newPage.children[currentIndex == null ? 0 : currentIndex];
  };

  do {
    if (current == null) break;

    const result = searchInPage(current, queryKey);

    // Case 1: Leaf node with available space → perform direct insert
    if (isAbleToInsert(current) && !inserted) {
      const pageAfterInsert = insertInPage(current, queryKey);

      // Since the insertion creates new object due to keep immutability, we have to re-reference it
      reReference(pageAfterInsert);

      current = pageAfterInsert;
      inserted = true;
      unbalanced = false;
    }

    // Case 2: Overflow detected → split the page and propogate primary key to parent
    if (isPageOverflows(current)) {
      unbalanced = true;

      const parent = returnStack.pop();

      const pageAfterPropagate = propagate(current, parent?.page);

      reReference(pageAfterPropagate);

      continue;
    }

    if (result.end || result.index == null) {
      break;
    }

    unbalanced = false;
    returnStack.push({ page: current, childIndex: result.index });
    current = current.children[result.index];
  } while (!(inserted && !unbalanced));

  return returnStack.pop()?.page ?? current;
}

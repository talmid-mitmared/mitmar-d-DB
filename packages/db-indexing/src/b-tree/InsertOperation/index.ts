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
  let parentStack: { page: $BtPage; nextTraverseIndex: number }[] = [];
  let current = page;
  let inserted = false;
  let unbalanced = false;

  const reReference = (newPage: $BtPage) => {
    const parent = parentStack.pop();

    // Since the insertion creates new object due to keep immutability, we have to re-reference it
    if (parent != null) {
      parent.page.children[parent.nextTraverseIndex] = newPage;
      parentStack.push(parent);
      current = newPage;
    }
  };

  do {
    const result = searchInPage(current, queryKey);

    const isNoDuplicates = result.value == null;

    // Case 1: Leaf node with available space → perform direct insert
    if (isAbleToInsert(current) && !inserted && isNoDuplicates) {
      const pageAfterInsertion = insertInPage(current, queryKey);

      // Since the insertion creates new object due to keep immutability, we have to re-reference it
      reReference(pageAfterInsertion);

      current = pageAfterInsertion;
      inserted = true;
    }

    // Case 3: Overflow detected → split the page and promote median to parent
    if (isPageOverflows(current)) {
      unbalanced = true;

      const parent = parentStack.pop();

      const pageAfterPropagation = propagate(current, parent?.page);

      const isNewParentOverflows = isPageOverflows(pageAfterPropagation);

      if (isNewParentOverflows) {
        current = pageAfterPropagation;

        continue;
      }

      const { index: currentIndex } = searchInPage(pageAfterPropagation, queryKey);
      const isRoot = parentStack.length === 0;

      if (!isNewParentOverflows) {
        if (isRoot) {
          parentStack.push({ page: pageAfterPropagation, nextTraverseIndex: currentIndex! });
          current = pageAfterPropagation.children[currentIndex!];
          unbalanced = false;
        } else {
          const grandParent = parentStack.pop();

          if (grandParent != null) {
            reReference(pageAfterPropagation);
            unbalanced = false;
          }
        }
      }

      continue;
    }

    if (result.end || result.index == null) {
      break;
    }

    unbalanced = false;
    parentStack.push({ page: current, nextTraverseIndex: result.index });

    current = current.children[result.index];
  } while (!(inserted && !unbalanced));

  return parentStack.pop()?.page ?? current;
}

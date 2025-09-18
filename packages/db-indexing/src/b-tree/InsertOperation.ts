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
 * @todo This is a "raw insert" — add structural validation or move to safer builder pattern.
 */
export function insertInPage(page: $BtPage, queryKey: number): $BtPage {
  page.recordKeys.push(queryKey);
  page.recordKeys.sort((a, b) => a - b);

  return createBtreePage(page);
}

/**
 * Recursive B-tree insert operation with self-balancing guarantees.
 */
export function insertInTree(page: $BtPage, queryKey: number, parentPage?: $BtPage): $BtPage {
  let parentStack: { page: $BtPage; index: number }[] = [];
  let current = page;
  let inserted = false;
  let unbalanced = false;

  do {
    const result = searchInPage(current, queryKey);

    console.dir(result, { depth: null });

    const isQueryKeyNotExists = result.value == null;

    // Case 2: Leaf node with available space → perform direct insert
    if (!inserted && isAbleToInsert(current) && isQueryKeyNotExists) {
      const revisedPage = insertInPage(current, queryKey);

      const parent = parentStack.pop();

      if (parent != null) {
        parent.page.children[parent.index] = revisedPage;
        parentStack.push(parent);
      }

      current = revisedPage;
      inserted = true;

      if (isPageOverflows(current)) unbalanced = true;

      continue;
    }

    // Case 3: Overflow detected → split the page and promote median to parent
    if (unbalanced) {
      const parent = parentStack.pop();

      const revisedParentPage = propagation(page, parent?.page);

      const grandParent = parentStack.pop();

      if (grandParent != null) {
        grandParent.page.children[grandParent.index] = revisedParentPage;
        parentStack.push(grandParent);
      }

      const { index: currentIndex } = searchInPage(revisedParentPage, queryKey);

      parentStack.push({ page: revisedParentPage, index: currentIndex as number });
      current = revisedParentPage.children[currentIndex as number];

      if (!isPageOverflows(current)) unbalanced = false;

      continue;
    }

    if (result.end || result.index == null) {
      break;
    }

    parentStack.push({ page: current, index: result.index });
    current = current.children[result.index];
  } while (!inserted && !unbalanced);

  return page;
}

/**
 * Splits a full page and promotes its median key to the parent.
 */
export function propagation(currentPage: $BtPage, parentPage?: $BtPage): $BtPage {
  const { primaryKey, children: newChildren } = splitPageIntoHalf(currentPage);

  // Case: If no parent; if current page is a root, create parent page
  if (parentPage == null) {
    return createBtreePage({
      ...currentPage,
      recordKeys: [primaryKey],
      children: newChildren,
    });
  }

  const newParentPage = insertInPage(parentPage, primaryKey);

  const { index } = searchInPage(newParentPage, primaryKey);

  // Case: Not only primary key being promoted to parent, the children also has to promoted
  const updatedChildren = insertElementInLists({
    baseLists: newParentPage.children,
    indexToInsert: index as number,
    elementsToInsert: newChildren,
  });

  return createBtreePage({
    ...newParentPage,
    children: updatedChildren,
  });
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
  const splitedChildren = divideListsIntoHalf({
    lists: page.children,
    standard: page.minimumDegree,
  });

  // Divide keys while skipping the promoted median
  const splitedKeys = divideListsIntoHalf({
    lists: page.recordKeys,
    standard: primaryIndex,
    skipMiddle: true,
  });

  const leftPage = createBtreePage({
    ...page,
    recordKeys: splitedKeys.left,
    children: splitedChildren.left,
  });

  const rightPage = createBtreePage({
    ...page,
    recordKeys: splitedKeys.right,
    children: splitedChildren.right,
  });

  return {
    primaryIndex,
    children: [leftPage, rightPage],
    primaryKey,
  };
}

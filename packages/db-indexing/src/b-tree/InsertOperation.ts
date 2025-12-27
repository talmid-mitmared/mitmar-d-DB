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

  return createBtreePage({
    ...page,
  });
}

export function insertInTree(page: $BtPage, queryKey: number) {
  let parentStack: { page: $BtPage; nextTraverseIndex: number }[] = [];
  let current = page;
  let inserted = false;
  let unbalanced = false;

  do {
    const result = searchInPage(current, queryKey);

    const isNoDuplicates = result.value == null;

    // Case 2: Leaf node with available space → perform direct insert
    if (isAbleToInsert(current) && !inserted && isNoDuplicates) {
      const pageAfterInsertion = insertInPage(current, queryKey);

      const parent = parentStack.pop();

      // Since the insertion creates new object due to keep immutability, we have to re-reference it
      if (parent != null) {
        parent.page.children[parent.nextTraverseIndex] = pageAfterInsertion;
        parentStack.push(parent);
      }

      current = pageAfterInsertion;
      inserted = true;
    }

    // Case 3: Overflow detected → split the page and promote median to parent
    if (isPageOverflows(current)) {
      unbalanced = true;

      const parent = parentStack.pop();

      const pageAfterPromotion = promotePage(current, parent?.page);

      const { index: currentIndex, end, value } = searchInPage(pageAfterPromotion, queryKey);

      if (end && value === queryKey) break;

      if (isPageOverflows(pageAfterPromotion)) {
        current = pageAfterPromotion;
      } else {
        parentStack.push({ page: pageAfterPromotion, nextTraverseIndex: currentIndex! });
        current = pageAfterPromotion.children[currentIndex!];
        unbalanced = false;
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

/**
 * Splits a full page and promotes its median key to the parent.
 */
export function promotePage(currentPage: $BtPage, parentPage?: $BtPage): $BtPage {
  const { primaryKey: promotedKey, children: childrenAfterPromotion } =
    splitPageIntoHalf(currentPage);

  // Case: If no parent; if current page is a root, create parent page
  if (!parentPage || parentPage.recordKeys.length === 0) {
    return createBtreePage({
      ...currentPage,
      recordKeys: [promotedKey],
      children: childrenAfterPromotion,
    });
  }

  // Case: If there is a  parent; insert new promoted key in parent page
  const newParentPage = insertInPage(parentPage, promotedKey);

  // We have to add new children that cause by primary key promotion.
  // But the question is how will we choose the insert the new children?
  // |
  // |
  // -> use search logic again to find the index to insert
  const { index } = searchInPage(newParentPage, promotedKey);

  // Case: Not only primary key being promoted to parent, the children also has to promoted
  const updatedChildren = insertElementInLists({
    baseLists: newParentPage.children,
    indexToInsert: index!,
    elementsToInsert: childrenAfterPromotion,
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

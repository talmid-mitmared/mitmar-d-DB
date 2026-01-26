import { insertInPage } from '.';
import { divideListsIntoHalf, insertElementInLists } from '../../utils/array';
import { $BtPage, createBtreePage, getIndexOfPrimaryKey } from '../Page';
import { searchInPage } from '../SearchOperation';

/**
 * Splits a full page and propagate its median key to the parent.
 */
export function propagate(currentPage: $BtPage, parentPage?: $BtPage): $BtPage {
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

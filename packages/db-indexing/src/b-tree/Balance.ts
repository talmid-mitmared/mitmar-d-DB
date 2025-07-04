import { deleteElementInLists, insertElementInLists } from '../utils/array';
import { getRelativeIndex } from '../utils/page';
import { extractKeyInPage } from './DeleteOperation';
import { insertInPage } from './InsertOperation';
import {
  $BtPage,
  createBtreePage,
  getPredecessorIndex,
  getSucessorIndex,
  isPageLeaf,
} from './Page';
import { searchInPage } from './SearchOperation';
import {
  getChildSiblingIndexs,
  isBothSiblingsWillUnderflows,
  isSiblingWillUnderflows,
} from './Underflows';

export function rebalanceLeafOperation(queryKey: number, page: $BtPage) {
  const ableToBorrowFromChildren = !isBothSiblingsWillUnderflows(queryKey, page);

  if (ableToBorrowFromChildren) {
    const updatedPage = balanceFromBorrowSiblings(queryKey, page);

    return updatedPage;
  }

  const { index: currentIndex } = searchInPage(page, queryKey);

  if (currentIndex == null) return page;

  const updatedPage = balanceFromMergeSiblings(currentIndex, page);

  return updatedPage;
}

/**
 * Resolves underflow by rebalancing the parent and child using sibling borrowing.
 *
 * This is a two-step recovery operation used when a child node is underflowing:
 * 1. **Borrow from sibling** → A key is taken from a left/right sibling and moved up into the parent.
 * 2. **Borrow from parent** → The parent pushes a key down to the underflowing child, completing the redistribution.
 */
export function balanceFromBorrowSiblings(queryKey: number, parentPage: $BtPage): $BtPage {
  const { index: currentIndex } = searchInPage(parentPage, queryKey);

  const { rightSiblingIndex, leftSiblingIndex } = getChildSiblingIndexs(currentIndex, parentPage);

  // Defensive: Can't rebalance if we don't know which child underflowed
  if (currentIndex == null) return parentPage;

  /**
   * Step 1: Borrow a key from a sibling and move it into the parent
   */
  const parentPageWithDebt = borrowKeyFromChildren(rightSiblingIndex, leftSiblingIndex, parentPage);

  /**
   * Step 2: Push a key from the (now updated) parent into the underflowed child
   */
  const parentPageWithNoDebt = borrowKeyFromParent(currentIndex, parentPageWithDebt);

  return createBtreePage(parentPageWithNoDebt);
}

/**
 * Handles underflow recovery by borrowing a key from the parent
 * and merging the underflowed child with one of its siblings.
 *
 * This method is used when both left and right siblings have
 * only the minimum number of keys, requiring a merge with
 * redistribution via the parent key.
 */
export function balanceFromMergeSiblings(currentIndex: number, parentPage: $BtPage): $BtPage {
  /**
   * Step 2: Move a key from parent to the underflowed child
   */
  const pageWithPulledParentKey = borrowKeyFromParent(
    getRelativeIndex(currentIndex, parentPage.recordKeys.length),
    parentPage,
  );

  /**
   * Step 3: Merge the borrowed child and its sibling - reduces the child count and restructures the tree
   */
  const mergedPage = mergeSiblingPages(
    currentIndex,
    getRelativeIndex(currentIndex, parentPage.children[currentIndex].recordKeys.length),
    pageWithPulledParentKey,
  );

  return createBtreePage(mergedPage);
}

/**
 * Attempts to resolve underflow by borrowing a key from a sibling node.
 *
 * This method assumes that a child node underflows and attempts to:
 *  - Borrow the predecessor from the left sibling (max key)
 *  - Or borrow the successor from the right sibling (min key)
 */
export function borrowKeyFromChildren(
  rightSiblingIndex: number | null,
  leftSiblingIndex: number | null,
  parentPage: $BtPage,
  doNotCheckUndeflows?: boolean,
): $BtPage {
  const canborrowFn = (borrowingIndex: number) => {
    return !isSiblingWillUnderflows(parentPage, borrowingIndex);
  };

  const canborrow = (borrowingIndex: number) =>
    doNotCheckUndeflows === false ? canborrowFn(borrowingIndex) : doNotCheckUndeflows;

  // Borrow predecessor (largest value in left sibling)
  if (leftSiblingIndex != null && canborrow(leftSiblingIndex)) {
    return atomicBorrowFromChild(
      leftSiblingIndex,
      getPredecessorIndex(parentPage.children[leftSiblingIndex]),
      parentPage,
    );
  }

  // Borrow successor (smallest value in right sibling)
  if (rightSiblingIndex != null && canborrow(rightSiblingIndex)) {
    return atomicBorrowFromChild(rightSiblingIndex, getSucessorIndex(), parentPage);
  }

  // Neither sibling can donate — return parent unchanged
  return parentPage;
}

export function borrowKeyFromParent(targetIndex: number, parentPage: $BtPage) {
  const updatedPage = atomicBorrowFromParent(targetIndex, parentPage);

  return updatedPage;
}

export function atomicBorrowFromChild(targetIndex: number, childIndex: number, page: $BtPage) {
  const { page: updatedPage, value } = extractKeyInPage(childIndex, page.children[targetIndex]);

  const insertedPage = insertInPage(page, value);

  return createBtreePage({
    ...insertedPage,
    children: insertElementInLists({
      baseLists: insertedPage.children,
      indexToInsert: targetIndex,
      elementsToInsert: updatedPage,
    }),
  });
}

export function atomicBorrowFromParent(targetIndex: number, page: $BtPage) {
  const { page: updatedPage, value } = extractKeyInPage(targetIndex, page);

  const insertedChildPage = insertInPage(updatedPage.children[targetIndex], value);

  return createBtreePage({
    ...updatedPage,
    children: insertElementInLists({
      baseLists: page.children,
      indexToInsert: targetIndex,
      elementsToInsert: insertedChildPage,
    }),
  });
}

function mergeChildren(baseIndex: number, targetIndex: number, parentPage: $BtPage): $BtPage {
  const minIndex = Math.min(baseIndex, targetIndex);
  const maxIndex = Math.max(baseIndex, targetIndex);

  const left = parentPage.children[minIndex];
  const right = parentPage.children[maxIndex];

  const mergedKeys = [...left.recordKeys, ...right.recordKeys];

  if (isPageLeaf(left) && isPageLeaf(right)) {
    return createBtreePage({
      recordKeys: mergedKeys,
      children: [],
      minimumDegree: left.minimumDegree,
    });
  }

  const totalChildren = left.children.length + right.children.length;
  const expectedChildren = mergedKeys.length + 1;
  const isCollision = totalChildren > expectedChildren;

  if (!isCollision) {
    return createBtreePage({
      recordKeys: mergedKeys,
      children: [...left.children, ...right.children],
      minimumDegree: left.minimumDegree,
    });
  }

  const { deletedValue: leftMerge, list: updatedLeft } = deleteElementInLists(
    left.children,
    getPredecessorIndex(left),
  );

  const { deletedValue: rightMerge, list: updatedRight } = deleteElementInLists(
    right.children,
    getSucessorIndex(),
  );

  const safeMergedChildren = createBtreePage({
    recordKeys: [...leftMerge.recordKeys, ...rightMerge.recordKeys],
    children: [...leftMerge.children, ...rightMerge.children],
    minimumDegree: left.minimumDegree,
  });

  return createBtreePage({
    recordKeys: mergedKeys,
    children: [...updatedLeft, safeMergedChildren, ...updatedRight],
    minimumDegree: left.minimumDegree,
  });
}

function mergeSiblingPages(baseIndex: number, targetIndex: number, parentPage: $BtPage): $BtPage {
  const clonedParent = createBtreePage(parentPage);

  const mergedNode = mergeChildren(baseIndex, targetIndex, parentPage);

  const parentIndex = getRelativeIndex(baseIndex, parentPage.recordKeys.length);

  return createBtreePage({
    ...parentPage,
    children: insertElementInLists({
      baseLists: parentPage.children,
      indexToInsert: parentIndex - 1,
      elementsToInsert: mergedNode,
      deleteCount: 2,
    }),
    minimumDegree: clonedParent.minimumDegree,
  });
}
export function rebalanceOperation(queryKey: number, page: $BtPage, parentPage: $BtPage) {
  const { index: childIndex } = searchInPage(page, queryKey);

  if (childIndex == null) return page;

  const ableToBorrowFromChildren = isBothSiblingsWillUnderflows(childIndex, page) === false;

  console.log(ableToBorrowFromChildren);

  if (ableToBorrowFromChildren) {
    const updatedPage = balanceFromBorrowSiblings(queryKey, parentPage);
    return updatedPage;
  }

  const { index: currentIndex } = searchInPage(parentPage, queryKey);

  if (currentIndex == null) return page;

  const updatedPage = balanceFromMergeSiblings(currentIndex, parentPage);

  return updatedPage;
}

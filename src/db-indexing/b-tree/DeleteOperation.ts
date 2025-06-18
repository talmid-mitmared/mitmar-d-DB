import { deleteElementInLists, insertElementInLists } from '../utils/array';
import { insertInPage } from './InsertOperation';
import {
  $BtPage,
  createBtreePage,
  getPredecessorIndex,
  getSucessorIndex,
  isPageWillUnderflows,
} from './Page';
import { searchInPage } from './SearchOperation';

export function deleteInTree(queryKey: number, page: $BtPage) {
  const { index, end, value } = searchInPage(page, queryKey);

  if (value == null && end) {
    return page;
  }

  const nextPage = page.children[index ?? -1];

  if (nextPage == null) return page;

  const nextSearchResult = searchInPage(nextPage, queryKey);

  const leafOperation = isLeafOperation({ ...nextSearchResult, queryKey });

  const internalOperation = isInternalOperation({
    ...nextSearchResult,
    queryKey,
  });

  const { rightSiblingIndex, leftSiblingIndex, baseIndex } =
    getChildSiblingIndexs(page, queryKey);

  // Step 1: If a leaf node has to be deleted
  if (leafOperation) {
    // Step 2: If the leaf node does not contain the minimum number elements
    if (isPageWillUnderflows(nextPage)) {
      const isNotAbleToBorrowFromSiblings =
        isSiblingWillUnderflows(page, rightSiblingIndex) &&
        isSiblingWillUnderflows(page, leftSiblingIndex);

      const isAbleToBorrowFromSiblings = !isNotAbleToBorrowFromSiblings;

      // Step 3: Fill the node by taking an element either from the left or from the right sibling
      if (isAbleToBorrowFromSiblings && baseIndex != null) {
        const lenderPage = borrowFromChildren(
          leftSiblingIndex,
          rightSiblingIndex,
          page,
        );

        const result = borrowFromParent(baseIndex, lenderPage);

        const deletedPage = deleteInPage(queryKey, result?.children[baseIndex]);

        deleteInTree(queryKey, deletedPage);

        return page;
      } else if (
        // Step 4: Else if both left and right siblings contain only the minimum number of elements
        isNotAbleToBorrowFromSiblings &&
        baseIndex != null
      ) {
        const newMergedPage = borrowFromParent(baseIndex, page);

        const deletedPage = deleteInPage(
          queryKey,
          newMergedPage?.children[baseIndex],
        );

        deleteInTree(queryKey, deletedPage);

        return page;
      }
    }
  }

  if (internalOperation) {
    const newPage = borrowFromChildren(
      leftSiblingIndex,
      rightSiblingIndex,
      page,
    );

    deleteInTree(queryKey, newPage);

    return page;
  }

  const deletedPage = deleteInPage(queryKey, nextPage);

  deleteInTree(queryKey, deletedPage);

  return page;
}

function borrowFromChildren(
  leftSiblingIndex: number | null,
  rightSiblingIndex: number | null,
  page: $BtPage,
) {
  const isAbleToBorrowFromLeftSib =
    isSiblingWillUnderflows(page, rightSiblingIndex) && leftSiblingIndex;

  const isAbleToBorrowFromRightSib =
    isSiblingWillUnderflows(page, leftSiblingIndex) && rightSiblingIndex;

  if (isAbleToBorrowFromLeftSib) {
    return ascendBorrowOperation(
      leftSiblingIndex,
      getPredecessorIndex(page),
      page,
    );
  }

  if (isAbleToBorrowFromRightSib) {
    return ascendBorrowOperation(rightSiblingIndex, getSucessorIndex(), page);
  }

  return page;
}

function borrowFromParent(pivotIndex: number, page: $BtPage) {
  const intervenedPage = descendBorrowOperation(pivotIndex, page);

  const targetIndex =
    pivotIndex === page.recordKeys.length ? pivotIndex - 1 : pivotIndex + 1;

  const clonedPage = createBtreePage(intervenedPage);
  const pivotChildren = clonedPage.children[pivotIndex];
  const targetChildren = clonedPage.children[targetIndex];

  const mergedKeys =
    targetIndex < pivotIndex
      ? [...targetChildren.recordKeys, ...pivotChildren.recordKeys]
      : [...pivotChildren.recordKeys, ...targetChildren.recordKeys];

  const mergedChildren = createBtreePage({
    recordKeys: mergedKeys,
    minimumDegree: page.minimumDegree,
    children: [],
  });

  return createBtreePage({
    ...intervenedPage,
    children: insertElementInLists({
      baseLists: intervenedPage.children,
      indexToInsert: Math.min(targetIndex, pivotIndex),
      elementsToInsert: mergedChildren,
      deleteCount: 2,
    }),
  });
}

function descendBorrowOperation(pivotIndex: number, page: $BtPage) {
  const { page: lender, value } = extractKeyInPage(pivotIndex, page);

  const childPageAfterBorrow = insertInPage(lender.children[pivotIndex], value);

  return createBtreePage({
    ...lender,
    children: insertElementInLists({
      baseLists: page.children,
      indexToInsert: pivotIndex,
      elementsToInsert: childPageAfterBorrow,
    }),
  });
}

function ascendBorrowOperation(
  pivotIndex: number,
  childIndex: number,
  page: $BtPage,
) {
  const { page: lender, value } = extractKeyInPage(
    childIndex,
    page.children[pivotIndex],
  );

  const pageAfterBorrow = insertInPage(page, value);

  return createBtreePage({
    ...pageAfterBorrow,
    children: insertElementInLists({
      baseLists: pageAfterBorrow.children,
      indexToInsert: pivotIndex,
      elementsToInsert: lender,
    }),
  });
}

function extractKeyInPage(index: number, page: $BtPage) {
  const { deletedValue, list } = deleteElementInLists(page.recordKeys, index);

  return {
    page: createBtreePage({
      ...page,
      recordKeys: list,
    }),
    value: deletedValue,
  };
}

function deleteInPage(queryKey: number, page: $BtPage) {
  const { index, value } = searchInPage(page, queryKey);

  if (value === queryKey && index != null) {
    const { list } = deleteElementInLists(page.recordKeys, index);

    return createBtreePage({
      ...page,
      recordKeys: list,
    });
  }

  return page;
}

function isLeafOperation({
  value,
  end,
  queryKey,
}: {
  value: number | null;
  end: boolean;
  queryKey: number;
}) {
  return end === true && value === queryKey;
}

function isInternalOperation({
  value,
  end,
  queryKey,
}: {
  value: number | null;
  end: boolean;
  queryKey: number;
}) {
  return end === false && value === queryKey;
}

function isSiblingWillUnderflows(page: $BtPage, index: number | null) {
  if (index == null) return true;

  const sibling = page.children[index];

  return isPageWillUnderflows(sibling);
}

function getChildSiblingIndexs(page: $BtPage, queryKey: number) {
  const { index: childIndex } = searchInPage(page, queryKey);

  const isLeftMost = childIndex === 0;
  const isRightMost = childIndex === page.children.length - 1;

  if (isLeftMost) {
    return {
      leftSiblingIndex: null,
      baseIndex: childIndex,
      rightSiblingIndex: childIndex + 1,
    };
  }

  if (isRightMost) {
    return {
      leftSiblingIndex: childIndex - 1,
      baseIndex: childIndex,
      rightSiblingIndex: null,
    };
  }

  return {
    leftSiblingIndex: (childIndex as number) - 1,
    baseIndex: childIndex,
    rightSiblingIndex: (childIndex as number) + 1,
  };
}

import {
  $BtPage,
  createBtreePage,
  getPredecessorIndex,
  getSucessorIndex,
  isPageLeaf,
  isPageWillUnderflows,
} from '../Page';
import { getSiblingChildPages } from './rebalanceUtils';
import { searchInPage } from '../SearchOperation';
import { borrowKeyFromChildPage, isAbleToBorrowFromChildren } from './borrow';
import { extractKeyInPage } from '../DeleteOperation';
import { insertInPage } from '../InsertOperation';

function rebalanceFromBorrowingChild(props: { queryKey: number; parentPage: $BtPage }) {
  const { left, right } = getSiblingChildPages(props);

  if (isPageWillUnderflows(left.page) === false && left.index != null) {
    const result = borrowKeyFromChildPage(left.index, props.parentPage, 'LEFT');

    const { value: deletedKey, page } = extractKeyInPage(left.index + 1, result.parentPage);

    insertInPage(page.children[left.index + 1], deletedKey);

    return page;
  }

  return props.parentPage;
}

export function rebalanceLeafOperation(queryKey: number, page: $BtPage) {
  const ableToBorrow = isAbleToBorrowFromChildren({ parentPage: page, queryKey });

  if (ableToBorrow) {
    const newPage = rebalanceFromBorrowingChild({
      parentPage: page,
      queryKey,
    });

    return newPage;
  }

  const { index: currentIndex } = searchInPage(page, queryKey);

  if (currentIndex == null) return page;

  const updatedPage = balanceFromMergeSiblings({ parentPage: page, queryKey });

  return updatedPage;
}

function balanceFromMergeSiblings(props: { queryKey: number; parentPage: $BtPage }) {
  const { left, right } = getSiblingChildPages(props);

  const targetParentIndex = left.index ?? right.index;

  if (targetParentIndex == null) return props.parentPage;
}

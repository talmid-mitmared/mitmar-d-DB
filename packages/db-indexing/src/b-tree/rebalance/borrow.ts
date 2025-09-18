import { insertElementInLists } from '../../utils';
import { extractKeyInPage } from '../DeleteOperation';
import { insertInPage } from '../InsertOperation';
import {
  $BtPage,
  createBtreePage,
  getPredecessorIndex,
  getSucessorIndex,
  isPageWillUnderflows,
} from '../Page';
import { searchInPage } from '../SearchOperation';
import { getSiblingChildPages } from './rebalanceUtils';
import { deleteKeyInChild } from './utils';

type BorrowDirectionType = 'LEFT' | 'RIGHT';

function getKeyToBorrowByDirection(page: $BtPage, direction: 'LEFT' | 'RIGHT') {
  if (direction === 'LEFT') {
    return getPredecessorIndex(page);
  }

  return getSucessorIndex();
}

export function borrowKeyFromChildPage(
  childIndex: number,
  parentPage: $BtPage,
  childDirection: BorrowDirectionType,
) {
  console.log('basdfasdf');

  const childKeyIndex = getKeyToBorrowByDirection(parentPage.children[childIndex], childDirection);

  const result = deleteKeyInChild(childIndex, childKeyIndex, parentPage);

  return {
    parentPage: createBtreePage(insertInPage(result.parentPage, result.deletedKey)),
  };
}

export function borrowKeyFromParentPage(indexToExtract: number, parentPage: $BtPage) {
  const { page: extractedPage, value } = extractKeyInPage(indexToExtract, parentPage);
  const DELETE_COUNT = 1 as const;

  const { index: indexToInsert } = searchInPage(parentPage, value);

  if (indexToInsert == null) return parentPage;

  const insertedChildPage = insertInPage(
    extractedPage.children[indexToInsert + DELETE_COUNT],
    value,
  );

  return createBtreePage(insertedChildPage);
}

export function isAbleToBorrowFromChildren(props: { queryKey: number; parentPage: $BtPage }) {
  const { left, right } = getSiblingChildPages(props);

  if (isPageWillUnderflows(left.page) && isPageWillUnderflows(right.page)) {
    return false;
  }

  return true;
}

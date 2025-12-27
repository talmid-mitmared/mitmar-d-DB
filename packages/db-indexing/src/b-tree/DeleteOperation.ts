import { deleteElementInLists } from '../utils/array';
import { borrowKeyFromChildren } from './Balance';
import { $BtPage, createBtreePage, isPageLeaf, isPageOverflows, isPageUnderflows } from './Page';
import { rebalanceLeafOperation } from './rebalance';
import { searchInPage } from './SearchOperation';

export function deleteInTree(page: $BtPage, queryKey: number): $BtPage {
  let current = page;
  let deleted = false;
  let unbalanced = false;

  const travserHistory: $BtPage[] = [];

  do {
    const { index, end, value } = searchInPage(current, queryKey);

    const queryHit = value != null && index != null;

    if (!queryHit && index != null) {
      travserHistory.push(current);
      current = current.children[index];

      continue;
    }

    if (!queryHit && end) {
      deleted = true;
      unbalanced = true;
      break;
    }

    if (queryHit) {
      if (end) {
        const { page } = deleteInPage(queryKey, current);

        const parentPage = travserHistory.pop();

        if (isPageUnderflows(page) && parentPage) {
          const stablePage = rebalanceLeafOperation(queryKey, parentPage);
        }
      } else {
        const { page, index: childIndex } = internalDeleteOperation(queryKey, current);

        if (childIndex != null && isPageUnderflows(page.children[childIndex])) {
          console.dir(page, { depth: null });
        }
      }

      deleted = true;
    }
  } while (deleted === false && unbalanced === false);

  return page;
}

function internalDeleteOperation(queryKey: number, page: $BtPage) {
  const { index } = searchInPage(page, queryKey);

  if (index == null) {
    return {
      page,
      index,
    };
  }

  const updatedPage = borrowKeyFromChildren(index, index, page, true);

  return deleteInPage(queryKey, updatedPage);
}

function deleteInPage(queryKey: number, page: $BtPage) {
  const { index, value } = searchInPage(page, queryKey);

  if (value != null && index != null) {
    const deletedResult = extractKeyInPage(index, page);

    return {
      page: createBtreePage(deletedResult.page),
      index,
    };
  }

  return {
    page: createBtreePage(page),
    index,
  };
}

export function extractKeyInPage(index: number, page: $BtPage) {
  const { deletedValue, list } = deleteElementInLists(page.recordKeys, index);

  return {
    page: createBtreePage({
      ...page,
      recordKeys: list,
    }),
    value: deletedValue,
  };
}

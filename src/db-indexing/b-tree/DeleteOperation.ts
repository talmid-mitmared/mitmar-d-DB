import { deleteElementInLists } from '../utils/array';
import {
  balanceFromBorrowedSiblings,
  balanceFromMergedSiblings,
  isBothSiblingsWillUnderflows,
} from './Balance';
import { $BtPage, createBtreePage, isPageWillUnderflows } from './Page';
import { searchInPage } from './SearchOperation';

/**
 * Deletes a key from a B-tree while maintaining balance.
 *
 * Recursive deletion algorithm that supports:
 * 1. Leaf deletions
 * 2. Borrowing from siblings
 * 3. Merging underflowed nodes
 *
 * The tree remains balanced at every level by rotating or merging when necessary.
 *
 * @param page - Current B-tree node (may be root or child)
 * @param queryKey - The key to delete
 * @param parentPage - Optional reference to parent node
 * @returns Updated subtree rooted at `page`
 */
export function deleteInTree(
  page: $BtPage,
  queryKey: number,
  parentPage?: $BtPage,
): $BtPage {
  const { index, end, value } = searchInPage(page, queryKey);

  // Case 1: Key not found and reached leaf — no further traversal
  if (value !== queryKey && end) {
    return page;
  }

  // Case 2: Key not found yet, but node has children — descend
  if (value !== queryKey && !end && index != null) {
    deleteInTree(page.children[index], queryKey, page);
    return page;
  }

  /**
   * Case 3: Match found on leaf node
   * This means we can safely delete the key without restructuring (yet)
   */
  const isLeafOperation = end && value === queryKey;

  // Case 4: Leaf node deletion that may cause underflow
  if (
    isLeafOperation &&
    isPageWillUnderflows(page) // Checks if page will be below minimum key count
  ) {
    const canBorrow =
      isBothSiblingsWillUnderflows(queryKey, parentPage) === false;

    // Case 4a: Borrow from left or right sibling
    if (canBorrow && parentPage) {
      const updatedPage = balanceFromBorrowedSiblings(queryKey, parentPage);

      const { index: nextIndex } = searchInPage(updatedPage, queryKey);

      if (nextIndex == null) return updatedPage;

      deleteInTree(updatedPage.children[nextIndex], queryKey, updatedPage);

      return page;
    }

    // Case 4b: Both siblings too small — merge with one sibling and pull key from parent
    if (!canBorrow && parentPage) {
      const updatedPage = balanceFromMergedSiblings(queryKey, parentPage);

      const { index: nextIndex } = searchInPage(updatedPage, queryKey);

      if (nextIndex == null) return updatedPage;

      deleteInTree(updatedPage.children[nextIndex], queryKey, updatedPage);

      return page;
    }
  }

  // Case 5: Safe to delete from current page (non-underflowing leaf or internal)
  const deletedPage = deleteInPage(queryKey, page);

  deleteInTree(deletedPage, queryKey, parentPage);

  return page;
}

function deleteInPage(queryKey: number, page: $BtPage) {
  const { index, value } = searchInPage(page, queryKey);

  if (value === queryKey && index != null) {
    const deletedResult = extractKeyInPage(index, page);

    return deletedResult.page;
  }

  return page;
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

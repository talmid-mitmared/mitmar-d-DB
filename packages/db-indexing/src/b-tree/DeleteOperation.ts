import { deleteElementInLists } from '../utils/array';
import { borrowKeyFromChildren, rebalanceLeafOperation, rebalanceOperation } from './Balance';
import { $BtPage, createBtreePage, isPageOverflows, isPageUnderflows } from './Page';
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
export function deleteInTree(page: $BtPage, queryKey: number, parentPage?: $BtPage): $BtPage {
  const { index, end, value } = searchInPage(page, queryKey);

  // If there is no root key, replace it
  if (page.recordKeys.length === 0 && page.children.length === 1) {
    return page.children[0];
  }

  const isRebalanceOperation = parentPage && index != null && isPageUnderflows(page);

  if (isRebalanceOperation) {
    const rebalancedPage = rebalanceOperation(queryKey, page, parentPage);

    return rebalancedPage; // The rebalance page always return the revised parent page
  }

  const queryHit = value === queryKey && index != null;

  /**
   * Delete Operation:
   * 1. Target query key must be found in current page
   * 2. Current page isn't underflows; The length of page key lists is less than minimum key length
   */
  const isDeleteOperation = queryHit && !isPageUnderflows(page);

  if (isDeleteOperation) {
    const isLeafOperation = end;
    const isInternalOperation = !isLeafOperation;

    if (isLeafOperation) {
      const deletedPage = deleteInPage(queryKey, page);

      return deleteInTree(deletedPage, queryKey, parentPage);
    }

    if (isInternalOperation) {
      const deletedPage = internalDeleteOperation(queryKey, page);

      console.log(deletedPage);

      return deleteInTree(deletedPage, queryKey, parentPage);
    }
  }

  if (end || index == null) {
    return page;
  }

  return deleteInTree(page.children[index], queryKey, page);
}

type Frame = {
  node: $BtPage;
  index: number | null;
  end: boolean;
};

export function deleteInTreeV2(page: $BtPage, queryKey: number) {
  const path: Frame[] = [];

  let current = page;
  let unbalanced = false;
  let deleted = false;

  while (!deleted) {
    const { index, value, end } = searchInPage(current, queryKey);

    const queryHit = value === queryKey;
    if (queryHit && index != null) {
      const isLeaf = queryHit && end === true;
      const isInternal = queryHit && end === false;

      if (isLeaf) {
        const updatedPage = deleteInPage(queryKey, current);

        if (isPageUnderflows(updatedPage)) {
          unbalanced = true;
        }

        current = updatedPage;
        deleted = true;
      }

      if (isInternal) {
        const updatedPage = internalDeleteOperation(queryKey, current);

        if (isPageUnderflows(updatedPage?.children[index])) {
          unbalanced = true;
        }

        current = updatedPage;
        deleted = true;
      }

      const parent = path.pop();

      if (parent) {
        parent.node.children[parent.index as number] = current;
        path.push(parent);
      }

      path.push({ node: current, index, end });

      if (isInternal) {
        const { end: childEnd } = searchInPage(current.children[index], queryKey);
        path.push({
          node: current.children[index],
          index: current.children[index].recordKeys.length - 1,
          end: childEnd,
        });
      }
    } else path.push({ node: current, index, end });

    if (index == null || end) break;

    current = current.children[index];
  }
  if (unbalanced === false) return page;

  while (unbalanced) {
    const underflowedPage = path.pop();
    const parentPage = path.pop();

    if (parentPage?.index == null) break;

    const rebalanced = rebalanceLeafOperation(queryKey, parentPage!.node);

    if (isPageOverflows(rebalanced) === false) {
      unbalanced = false;
      const rootPage = path.pop();

      return createBtreePage({
        ...rootPage!.node,
        children: rootPage!.node.children.map((c, i) => (i === rootPage!.index ? rebalanced : c)),
      });
    }
  }
  return page;
}

function internalDeleteOperation(queryKey: number, page: $BtPage) {
  const { index } = searchInPage(page, queryKey);

  if (index == null) {
    return page;
  }

  const updatedPage = borrowKeyFromChildren(index, index, page, true);

  return deleteInPage(queryKey, updatedPage);
}

function deleteInPage(queryKey: number, page: $BtPage) {
  const { index, value } = searchInPage(page, queryKey);

  if (value === queryKey && index != null) {
    const deletedResult = extractKeyInPage(index, page);

    return createBtreePage(deletedResult.page);
  }

  return createBtreePage(page);
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

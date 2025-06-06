import { PageCore, RecordKey } from './b-tree/Pages';
import {
  divideListsIntoHalf,
  getSubListsOfOrigin,
  insertElementInLists,
} from './b-tree/utils';

function getNextChildIndexForTraverse(page: PageCore, query: RecordKey) {
  if (page.isPageLeaf()) {
    console.error(
      'There is no children to traverse, you reached leaf of the tree',
    );
    return null;
  }

  const index = page.recordKeys.findIndex((element) => query < element);

  if (index === -1) {
    return page.recordKeys.length;
  }

  return index;
}

export function search(page: PageCore, queryKey: RecordKey): boolean {
  const queryFounded = page.recordKeys.includes(queryKey);

  if (queryFounded) {
    return true;
  }

  if (page.isPageLeaf() && queryFounded === false) {
    return false;
  }

  const childIndex = getNextChildIndexForTraverse(page, queryKey);

  if (childIndex == null) {
    return false;
  }

  return search(page.children[childIndex], queryKey);
}

export function insert(
  page: PageCore,
  queryKey: number,
  parentPage?: PageCore,
) {
  const hasParentPage = parentPage != null;

  if (
    /**
     * Inserts the key only if the current node is a leaf (i.e., has no children).
     * If the node isn't full, the key is inserted directly without needing a split.
     */
    page.isPageOverflows() === false &&
    page.isPageLeaf()
  ) {
    page.addKey(queryKey);

    return page;
  }

  if (
    /**
     * The page is full and a parent node exists — we must promote a key to the parent,
     * so a split operation is required.
     */
    page.isPageOverflows() &&
    hasParentPage
  ) {
    const { primaryKey, leftPage, rightPage } = splitPageIntoTwoPairs(page);

    const indexToInsert = getNextChildIndexForTraverse(parentPage, primaryKey);

    if (indexToInsert == null) return;

    parentPage.insertPagesToChildren(indexToInsert, [leftPage, rightPage]);
    parentPage.addKey = primaryKey;

    const currentPageIndex = getNextChildIndexForTraverse(parentPage, queryKey);

    if (currentPageIndex == null) return;

    insert(parentPage.children[currentPageIndex], queryKey, page);

    return;
  }

  const childIndex = getNextChildIndexForTraverse(page, queryKey);

  if (childIndex == null) return;

  insert(page.children[childIndex], queryKey, page);
}

function splitOperation(page: Page, parentPage: Page) {
  const { primaryKey, leftPage, rightPage } = splitPageIntoTwoPairs(page);

  const indexToInsert = parentPage.getNextChildIndexForTraverse(primaryKey);

  if (indexToInsert == null) {
    return null;
  }

  const updatedChildren = insertElementInLists({
    baseLists: parentPage.children,
    indexToInsert,
    elementsToInsert: [leftPage, rightPage],
  });

  return {
    primaryKey,
    updatedParentChildren: updatedChildren,
  };
}

// Splits this node into two new nodes and returns left/right + promoted middle key
function splitPageIntoTwoPairs(page: PageCore) {
  const indexOfPrimaryKey = page.indexOfPrimaryKey();
  const primaryKey = page.recordKeys[indexOfPrimaryKey];

  /**
   * When promoting a key, we must also consider splitting the child nodes.
   * The children are divided into left and right groups corresponding to the split.
   */
  const { left: leftChildren, right: rightChildren } = divideListsIntoHalf({
    lists: page.children,
    standard: page.minimumDegree,
  });

  const { left: leftKeys, right: rightKeys } = divideListsIntoHalf({
    lists: page.recordKeys,
    standard: indexOfPrimaryKey,
    skipMiddle: true,
  });

  const leftPage = new PageCore(page.minimumDegree, leftKeys, leftChildren);
  const rightPage = new PageCore(page.minimumDegree, rightKeys, rightChildren);

  return {
    leftPage,
    rightPage,
    primaryKey,
  };
}

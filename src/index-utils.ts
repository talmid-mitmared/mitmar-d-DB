import { PageCore, RecordKey, RecordKeys } from './b-tree/Pages';
import { insertElementInLists } from './b-tree/utils/array';

export function getNextIndexForTraverse(page: PageCore, query: RecordKey) {
  const index = page.recordKeys.findIndex((element) => query < element);

  if (index === -1) {
    return page.recordKeys.length;
  }

  return index;
}
export function getNextPageIndex<T>(lists: T[], query: T) {
  const index = lists.findIndex((element) => query < element);

  if (index === -1) {
    return lists.length;
  }

  return index;
}

export function findIndexToInsertKey(page: PageCore, query: RecordKey) {
  if (!page.isPageLeaf()) {
    console.error('Insertion has to be on leaf of the tree');
    return null;
  }

  const index = page.recordKeys.findIndex((element) => query < element);

  if (index === -1) {
    return page.recordKeys.length;
  }

  return index;
}

export function insertKeyInTargetIndex(
  baseLists: RecordKeys,
  indexToInsert: number,
  elementsToInsert: RecordKeys | RecordKey,
  indexToReplace?: number,
) {
  return insertElementInLists({
    baseLists,
    indexToInsert,
    deleteCount: indexToReplace,
    elementsToInsert,
  });
}

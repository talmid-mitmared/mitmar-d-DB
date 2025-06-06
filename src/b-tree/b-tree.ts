import { PageCore, RecordKey } from './Pages';
import { BtreeIterator } from './Search';

export class BTree {
  #root: PageCore;

  constructor(t: number) {
    this.#root = new PageCore(t);
  }

  private getIterator() {
    return new BtreeIterator();
  }

  public searchAll(page: PageCore, queryKey: RecordKey): number | null {
    const nextIndex = this.search(page, queryKey);

    if (nextIndex != null) {
      if (page.recordKeys[nextIndex] === queryKey) {
        return nextIndex;
      }

      const childToTraverse = page.children[nextIndex];

      return this.searchAll(childToTraverse, queryKey);
    }

    return null;
  }

  public search(page: PageCore, queryKey: RecordKey): number | null {
    const iterator = this.getIterator();

    const nextIndex = iterator.next(page, queryKey);

    if (nextIndex == null) {
      return null;
    }

    return nextIndex;
  }

  public insert(page: PageCore, queryKey: number) {
    const index = this.search(page, queryKey);

    if (index && page.recordKeys[index] === queryKey) return page;

    if (
      /**
       * Inserts the key only if the current node is a leaf (i.e., has no children).
       * If the node isn't full, the key is inserted directly without needing a split.
       */
      page.isPageOverflows() === false &&
      page.isPageLeaf()
    ) {
      page.insertKey(index, queryKey);

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

      const nextChildIndex = this.search(parentPage, primaryKey);

      const childrenToInsert = [leftPage, rightPage];

      parentPage.insertChildren(childIndexToInsert, childrenToInsert);

      const keyIndexToInsert = findIndexToInsertKey(page, queryKey);

      parentPage.insertKey(keyIndexToInsert, primaryKey);

      const currentPageIndex = getNextChildIndexForTraverse(
        parentPage,
        queryKey,
      );

      if (currentPageIndex == null) return;

      insert(parentPage.children[currentPageIndex], queryKey, page);

      return;
    }

    const childIndex = getNextChildIndexForTraverse(page, queryKey);

    if (childIndex == null) return;

    insert(page.children[childIndex], queryKey, page);
  }

  public get root() {
    return this.#root;
  }
}

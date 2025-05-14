import { insertElementInArray, sliceArrayToTargetIndex } from './utils';

export class Page {
  /**
   * Defines the minimum degree (t) of the B-tree.
   * This value being used for the tree's height, maximum number of keys per node, and branching factor.
   */
  private _minimumDegree: number;
  private _children: Page[] = [];
  private recordKeys: number[] = [];

  constructor(
    minimumDegree: number,
    keys: number[] = [],
    children: Page[] = [],
  ) {
    this._minimumDegree = minimumDegree;
    this.recordKeys = keys;
    this._children = children;
  }

  /**
   * Performs a search operation in the B-tree.
   * Time complexity: O(log N) in a balanced B-tree.
   */
  public Search(queryKey: number): number | null {
    const index = Page.GetSearchQueryIndex(this.recordKeys, queryKey);

    if (this.recordKeys?.[index - 1] === queryKey) {
      return queryKey;
    }

    if (this.isLeaf) {
      return null;
    }

    return this._children[index]?.Search(queryKey);
  }

  public Insert(queryKey: number, parentNode?: Page) {
    const isNotRoot = parentNode != null;
    if (
      /**
       * Inserts the key only if the current node is a leaf (i.e., has no children).
       * If the node isn't full, the key is inserted directly without needing a split.
       */
      this.isLeaf &&
      !this.isPageFull
    ) {
      return (this.appendNewRecordKeys = queryKey);
    }

    if (
      /**
       * The page is full and a parent node exists — we must promote a key to the parent,
       * so a split operation is required.
       */
      this.isPageFull &&
      isNotRoot
    ) {
      this.promoteIncomingPageAsParent(parentNode);

      const index = Page.GetSearchQueryIndex(parentNode.recordKeys, queryKey);

      parentNode._children[index]?.Insert(queryKey, this);
    }

    const index = Page.GetSearchQueryIndex(this.recordKeys, queryKey);

    this._children[index]?.Insert(queryKey, this);
  }

  public promoteIncomingPageAsParent(parentNode: Page) {
    const { primaryKey, leftPage, rightPage } = this.splitOperation();

    const newChildren = insertElementInArray({
      baseLists: parentNode._children,
      indexToInsert: Page.GetSearchQueryIndex(
        parentNode.recordKeys,
        primaryKey,
      ),
      elementsToInsert: [leftPage, rightPage],
    });

    parentNode.assignNewChildren = newChildren;
    parentNode.appendNewRecordKeys = primaryKey;
  }

  // Splits this node into two new nodes and returns left/right + promoted middle key
  private splitOperation() {
    const middleIndex = this.primaryKeyIndex;
    const primaryKey = this.recordKeys[middleIndex];

    /**
     * When promoting a key, we must also consider splitting the child nodes.
     * The children are divided into left and right groups corresponding to the split.
     */
    const { left: leftChildren, right: rightChildren } =
      Page.SliceArrayIntoLeftRight(this._children, this._minimumDegree);

    const leftKeys = sliceArrayToTargetIndex({
      lists: this.recordKeys,
      destIndex: middleIndex,
    });

    const rightKeys = sliceArrayToTargetIndex({
      lists: this.recordKeys,
      startIndex: middleIndex + 1,
      destIndex: this.recordKeys.length,
    });

    const leftPage = new Page(this._minimumDegree, leftKeys, leftChildren);
    const rightPage = new Page(this._minimumDegree, rightKeys, rightChildren);

    return {
      leftPage,
      rightPage,
      primaryKey,
    };
  }

  public get isLeaf() {
    return this._children.length === 0;
  }

  public get children() {
    return this._children;
  }

  public get isPageFull() {
    return (
      this.recordKeys.length >=
      BTree.MaxNumberOfKeysFormula(this._minimumDegree)
    );
  }

  public get getRecordKeys() {
    return this.recordKeys;
  }

  public get primaryKeyIndex() {
    return BTree.PrimaryKeyIndexFormula(this._minimumDegree);
  }

  public set assignNewKeys(keys: number[]) {
    this.recordKeys = keys;
  }

  public set assignNewChildren(children: Page[]) {
    this._children = children;
  }

  private set appendNewRecordKeys(key: number) {
    this.recordKeys.push(key);
    /**
     * @todo: Need to change it into binary sort
     */
    this.recordKeys.sort((a, b) => a - b);
  }

  static GetSearchQueryIndex<T>(lists: Array<T>, target: T) {
    const index = lists.findIndex((element) => target < element);
    if (index === -1) {
      return lists.length;
    }
    return index;
  }

  static SliceArrayIntoLeftRight<T>(lists: Array<T>, standard: number) {
    return {
      left: lists.slice(0, standard),
      right: lists.slice(standard),
    };
  }
}

export class BTree {
  private _minimumDegree: number;
  private root: Page;

  constructor(t: number) {
    this.root = new Page(t);
    this._minimumDegree = t;
  }

  public Insert(queryKey: number) {
    const queryFounded = this.root.Search(queryKey);

    if (queryFounded) return;

    if (this.root.isPageFull) {
      const newParentPage = new Page(this._minimumDegree);
      this.root.promoteIncomingPageAsParent(newParentPage);

      this.root = newParentPage;
    }

    this.root.Insert(queryKey);
  }

  public get rootPage() {
    return this.root;
  }

  static MaxNumberOfKeysFormula(degree: number) {
    const formula = (t: number) => {
      return 2 * t - 1;
    };
    return formula(degree);
  }

  static PrimaryKeyIndexFormula(degree: number) {
    const formula = (t: number) => {
      return t - 1;
    };
    return formula(degree);
  }
}

import { getNextPageIndex } from '../index-utils';
import { getIterator } from './Iterator';
import { $PageNode, createPageNodeImplObject } from './revised';
import { divideListsIntoHalf } from './utils';
export function isPageLeaf(childrenLength: number): boolean {
  return childrenLength === 0;
}

export function isPageOverflows(recordKeyLength: number, t: number): boolean {
  return recordKeyLength >= MaxNumberOfKeysFormula(t);
}

export function isPageUnderflows(recordKeyLength: number, t: number): boolean {
  return recordKeyLength < MinNumberOfKeysFormula(t);
}

export function getIndexOfPrimaryKey(t: number): number {
  return PrimaryKeyIndexFormula(t);
}
export function isPageAbleToInsert(
  recordKeyLength: number,
  childrenLength: number,
  t: number,
) {
  return (
    isPageUnderflows(recordKeyLength, t) === false && isPageLeaf(childrenLength)
  );
}

export function MaxNumberOfKeysFormula(degree: number) {
  const formula = (t: number) => {
    return 2 * t - 1;
  };
  return formula(degree);
}

export function MinNumberOfKeysFormula(degree: number) {
  const formula = (t: number) => {
    return t - 1;
  };
  return formula(degree);
}

export function PrimaryKeyIndexFormula(degree: number) {
  const formula = (t: number) => {
    return t - 1;
  };
  return formula(degree);
}

function Insert(
  this: $PageNode<number>,
  queryKey: number,
  parentPage?: $PageNode<number>,
) {
  const iterator = getIterator();

  iterator.next(this, queryKey);

  if (iterator.value() === queryKey) {
    return this;
  }

  const insertedPage = insert.call(this, queryKey);

  if (insertedPage != null) {
    return this;
  }

  const promotedPage = propagation.call(this, parentPage);

  if (promotedPage != null) {
    const nextIndex = getNextPageIndex(promotedPage.recordKeys, queryKey);

    Insert.call(promotedPage.children[nextIndex ?? 0], queryKey, promotedPage);

    return this;
  }

  const nextIndex = getNextPageIndex(this.recordKeys, queryKey);

  Insert.call(this.children[nextIndex ?? 0], queryKey, this);

  return this;
}

export function propagation(
  this: $PageNode<number>,
  parentPage?: $PageNode<number>,
) {
  if (
    /**
     * The page is full and a parent node exists — we must promote a key to the parent,
     * so a split operation is required.
     */
    isPageOverflows(this.recordKeys.length, this.minimumDegree)
  ) {
    const { primaryKey, children: newChildren } = splitPageIntoHalf.call(this);

    if (parentPage == null) {
      return createPageNodeImplObject(
        this.minimumDegree,
        [primaryKey],
        newChildren,
      );
    }

    parentPage.recordKeys.push(primaryKey);
    parentPage.recordKeys.sort((a, b) => a - b);

    return createPageNodeImplObject(
      this.minimumDegree,
      parentPage.recordKeys,
      newChildren,
    );
  }

  return null;
}

export function insert(this: $PageNode<number>, queryKey: number) {
  if (
    /**
     * Inserts the key only if the current node is a leaf (i.e., has no children).
     * If the node isn't full, the key is inserted directly without needing a split.
     */
    isPageAbleToInsert(
      this.recordKeys.length,
      this.children.length,
      this.minimumDegree,
    ) === true
  ) {
    this.recordKeys.push(queryKey);
    this.recordKeys.sort((a, b) => a - b);

    return this;
  }

  return null;
}

export class BTree {
  private root: $PageNode<number>;

  constructor(private degree: number) {
    this.root = createPageNodeImplObject<number>(degree);
    this.root.minimumDegree = 2;
  }

  public insert(key: number): void {
    Insert.call(this.root, key);
  }

  public getRoot(): $PageNode<number> {
    return this.root;
  }

  public toJSON(): object {
    return this.root;
  }
}

const tree = new BTree(2);

for (const key of [50, 40, 30, 20, 10, 60, 70, 80, 90, 100]) {
  tree.insert(key);
}

export function splitPageIntoHalf(this: $PageNode<number>) {
  const primaryIndex = getIndexOfPrimaryKey(this.minimumDegree);
  const primaryKey = this.recordKeys[primaryIndex];

  const { left: leftChildren, right: rightChildren } = divideListsIntoHalf({
    lists: this.children,
    standard: primaryIndex,
  });

  const { left: leftKeys, right: rightKeys } = divideListsIntoHalf({
    lists: this.recordKeys,
    standard: primaryIndex,
    skipMiddle: true,
  });

  const leftPage = createPageNodeImplObject(
    this.minimumDegree,
    leftKeys,
    leftChildren,
  );

  const rightPage = createPageNodeImplObject(
    this.minimumDegree,
    rightKeys,
    rightChildren,
  );
  return {
    primaryIndex,
    children: [leftPage, rightPage],
    primaryKey,
  };
}

// Utility functions used for B-tree operations
const utils = {
  // Returns a slice from startIndex to destIndex (not inclusive)
  sliceArrayToTargetIndex<T>({
    lists,
    startIndex = 0,
    destIndex,
  }: {
    lists: Array<T>;
    startIndex?: number;
    destIndex: number;
  }) {
    const leftKeys = lists.slice(startIndex, destIndex);
    return leftKeys;
  },

  // Inserts elementsToInsert into baseLists at indexToInsert (replacing 1 element — note: could be a logic bug)
  insertElementInArray<T>({
    baseLists,
    indexToInsert,
    elementsToInsert,
  }: {
    baseLists: Array<T>;
    indexToInsert: number;
    elementsToInsert: Array<T>;
  }) {
    baseLists.splice(indexToInsert, 1, ...elementsToInsert);
    return baseLists;
  },

  // Finds the first index where the target is less than the current list element
  // If not found, returns length (meaning go rightmost)
  getSearchQueryIndex<T>(lists: Array<T>, target: T) {
    const index = lists.findIndex((element) => target < element);
    if (index === -1) {
      return lists.length;
    }
    return index;
  },
};

// Represents a single B-tree node (aka "page")
class Page {
  public t: number; // Minimum degree
  private recordKeys: number[] = []; // Keys stored in the node
  public children: Page[] = []; // Child node references

  constructor(
    minimumDegree: number,
    keys: number[] = [],
    children: Page[] = [],
  ) {
    this.t = minimumDegree;
    this.recordKeys = keys;
    this.children = children;
  }

  // Searches recursively for a key in the B-tree
  public Search(queryKey: number): number | null {
    const index = utils.getSearchQueryIndex(this.recordKeys, queryKey);

    if (this.recordKeys?.[index - 1] === queryKey) {
      return queryKey;
    }

    if (this.isLeaf) {
      return null;
    }

    return this.children[index]?.Search(queryKey);
  }

  // Inserts a key into the B-tree, handling splits as necessary
  public Insert(queryKey: number, parentNode?: Page) {
    if (this.isLeaf && !this.isPageFull) {
      return (this.addNewRecordKeys = queryKey); // Insert into leaf node
    }

    if (this.isPageFull && parentNode) {
      this.splitChildren(parentNode); // Split current node and insert promoted key to parent

      const index = utils.getSearchQueryIndex(parentNode.recordKeys, queryKey);
      parentNode.children[index]?.Insert(queryKey, this); // Recurse down correct split
    }

    // Recurse to correct child
    const index = utils.getSearchQueryIndex(this.recordKeys, queryKey);
    this.children[index]?.Insert(queryKey, this);
  }

  // Assigns new keys to current node (used in split)
  public set assignNewKeys(keys: number[]) {
    this.recordKeys = keys;
  }

  // Assigns new children to current node (used in split)
  public set assignNewChildren(children: Page[]) {
    this.children = children;
  }

  // Adds a new key and keeps keys sorted
  private set addNewRecordKeys(key: number) {
    this.recordKeys.push(key);
    this.recordKeys.sort((a, b) => a - b);
  }

  // Splits current node and inserts result into parent
  public splitChildren(parentNode: Page) {
    const { primaryKey, leftPage, rightPage } = this.makePrimaryKey();

    const newChildren = utils.insertElementInArray({
      baseLists: parentNode.children,
      indexToInsert: parentNode.indexToInsert(primaryKey),
      elementsToInsert: [leftPage, rightPage],
    });

    parentNode.assignNewChildren = newChildren;
    parentNode.addNewRecordKeys = primaryKey;
  }

  // Splits this node into two new nodes and returns left/right + promoted middle key
  public makePrimaryKey() {
    const middleIndex = this.primaryKeyIndex;
    const primaryKey = this.recordKeys[middleIndex];

    const leftChildren = this.children.slice(0, this.t);
    const rightChildren = this.children.slice(this.t);

    const leftKeys = utils.sliceArrayToTargetIndex({
      lists: this.recordKeys,
      startIndex: 0,
      destIndex: middleIndex,
    });

    const leftPage = new Page(this.t, leftKeys, leftChildren);

    const rightKeys = utils.sliceArrayToTargetIndex({
      lists: this.recordKeys,
      startIndex: middleIndex + 1,
      destIndex: this.recordKeys.length,
    });

    const rightPage = new Page(this.t, rightKeys, rightChildren);

    return {
      leftPage,
      rightPage,
      primaryKey,
    };
  }

  // Finds the correct index for inserting a new key into the parent
  private indexToInsert(targetKey: number) {
    const index = this.recordKeys.findIndex((key) => targetKey < key);
    return index === -1 ? this.recordKeys.length : index;
  }

  // Whether this node is a leaf
  public get isLeaf() {
    return this.children.length === 0;
  }

  // Whether this node has reached its max key capacity
  public get isPageFull() {
    return this.recordKeys.length >= Page.MaxNumberOfKeysFormula(this.t);
  }

  public get getRecordKeys() {
    return this.recordKeys;
  }

  public get primaryKeyIndex() {
    return Page.PrimaryKeyIndexFormula(this.t);
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

  // Removes and returns the promoted key during split (currently unused)
  public get getSplicedPrimaryKey() {
    return this.recordKeys.splice(this.primaryKeyIndex, 1);
  }
}

// Main B-tree class
class BTree {
  public t: number;
  public root: Page;

  constructor(t: number) {
    this.root = new Page(t);
    this.t = t;
  }

  // Inserts a key into the B-tree
  insert(queryKey: number) {
    if (this.root.Search(queryKey) == null) {
      if (this.root.isPageFull) {
        const newParentPage = new Page(this.t);
        this.root.splitChildren(newParentPage);
        this.root = newParentPage;
      }
      this.root.Insert(queryKey);
    }
  }

  static MaxNumberOfKeys(t: number) {
    const formula = (t: number) => {
      return 2 * t - 1;
    };
    return formula(t);
  }

  static PrimaryKeyIndex(t: number) {
    const formula = (t: number) => {
      return t - 1;
    };
    return formula(t);
  }

  static MaxNumberofChildren(t: number) {
    const formula = (t: number) => {
      return 2 * t;
    };
    return formula(t);
  }
}

const btree = new BTree(2);
[
  0, -100, 42, -101, -5, 6, 17, 99999, 1000000, 1000001, 1000002, -120,
  100000003, 1000004, 1000005, 1000006, 1000006, 1000005, 1000005, 1000000,
  12341234,
].forEach((val) => {
  btree.insert(val);
});

generateDotFromBTree(btree.root);

// https:dreampuf.github.io/GraphvizOnline/?engine=dot
function generateDotFromBTree(
  node: Page,
  id = 0,
): { dot: string; nextId: number } {
  const nodeId = id;
  const numKeys = node.getRecordKeys.length;

  // Build the record label with keys and ports
  const labelParts: string[] = [];
  for (let i = 0; i < numKeys; i++) {
    labelParts.push(`<c${i}> | ${node.getRecordKeys[i]}`);
  }
  labelParts.push(`<c${numKeys}>`); //for the rightmost child

  let dot = `  node${nodeId} [label="${labelParts.join(' | ')}", shape=record];\n`;
  let nextId = id + 1;

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const childId = nextId;
    const childResult = generateDotFromBTree(child, childId);
    dot += childResult.dot;
    dot += `  node${nodeId}:c${i} -> node${childId};\n`;
    nextId = childResult.nextId;
  }

  return { dot, nextId };
}

function buildGraphviz(btree: BTree) {
  const { dot } = generateDotFromBTree(btree.root);
  return `digraph BTree {\n  node [shape=record, style=filled, fillcolor=white];\n${dot}}`;
}
function printBTree(node: Page, prefix = '', isTail = true) {
  console.log(
    `${prefix}${isTail ? '└── ' : '├── '}[${node.getRecordKeys.join(', ')}]`,
  );

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const isLast = i === node.children.length - 1;
    printBTree(child, prefix + (isTail ? '    ' : '│   '), isLast);
  }
}
const dotCode = buildGraphviz(btree);

console.log(printBTree(btree.root));

console.log(dotCode);
console.log(btree.root);

// const N = 100000;

// for (let i = 1; i <= N; i++) {
//   btree.insert(i);
// }

// console.log('Log base t of N:', Math.log(N) / Math.log(16));
// btree.root.validateStructure();

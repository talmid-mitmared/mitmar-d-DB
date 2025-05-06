class Node {
  public t: number;
  public keys: number[] = [];
  public children: Node[] = [];

  constructor(t: number, keys: number[] = []) {
    this.t = t;
    this.keys = keys;
  }

  public search(queryKey: number): number | null {
    let indexQuery = 0;
    while (indexQuery < this.keys.length) {
      const searchedKey = this.keys[indexQuery];

      if (queryKey === searchedKey) {
        return searchedKey;
      }

      if (queryKey < searchedKey) break;

      indexQuery++;
    }

    if (this.children.length === 0) {
      return null;
    }

    return this.children[indexQuery].search(queryKey);
  }

  public insert(queryKey: number, parentNode?: Node) {
    if (this.isLeaf()) {
      // Only last depth of node can operate this
      if (this.isKeysFull()) {
        const { primaryKey, leftNode, rightNode } = this.splitChild();

        if (parentNode == null) {
          this.keys = [primaryKey];

          this.children = [leftNode, rightNode];
        } else {
          const childIndex = parentNode.keys.findIndex(
            (key) => key > primaryKey,
          );
          parentNode.children.splice(childIndex, 1, leftNode, rightNode);
          parentNode.keys.push(primaryKey);
          parentNode.keys.sort((a, b) => a - b);
        }
      } else {
        this.keys.push(queryKey);
        this.keys.sort((a, b) => a - b);

        return;
      }
    }

    if (this.isLeaf() === false) {
      const leftIndex = this.keys.findIndex((key) => key > queryKey);

      const targetNode =
        leftIndex === -1
          ? this.children[this.children.length - 1]
          : this.children[leftIndex];

      targetNode.insert(queryKey, this);
    }
  }

  private splitChild() {
    const primaryIndex = BTree.PrimaryKeyIndex(this.t);

    const leftKeys = this.keys.slice(0, primaryIndex);
    const rightKeys = this.keys.slice(primaryIndex + 1);
    const primaryKey = this.keys[primaryIndex];

    const leftNode = new Node(this.t, leftKeys);
    const rightNode = new Node(this.t, rightKeys);

    return {
      leftNode,
      rightNode,
      primaryKey,
    };
  }

  private isLeaf() {
    return this.children.length === 0;
  }

  public isKeysFull() {
    return this.keys.length === BTree.MaxNumberOfKeys(this.t);
  }
}

class BTree {
  public t: number;
  public root: Node;

  constructor(t: number) {
    this.root = new Node(t);
    this.t = t;
  }

  insert(queryKey: number) {
    if (this.root.search(queryKey) == null) {
      this.root.insert(queryKey);
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
  50, 40, 30, 20, 10, 60, 70, 80, 90, 100, 50, 40, 30, 20, 10, 60, 70, 80, 90,
  100,
].forEach((val) => {
  btree.insert(val);
});

generateDotFromBTree(btree.root);

// https://dreampuf.github.io/GraphvizOnline/?engine=dot
function generateDotFromBTree(
  node: Node,
  id = 0,
): { dot: string; nextId: number } {
  const nodeId = id;
  const numKeys = node.keys.length;

  // Build the record label with keys and ports
  const labelParts: string[] = [];
  for (let i = 0; i < numKeys; i++) {
    labelParts.push(`<c${i}> | ${node.keys[i]}`);
  }
  labelParts.push(`<c${numKeys}>`); // for the rightmost child

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
function printBTree(node: Node, prefix = '', isTail = true) {
  console.log(`${prefix}${isTail ? '└── ' : '├── '}[${node.keys.join(', ')}]`);

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const isLast = i === node.children.length - 1;
    printBTree(child, prefix + (isTail ? '    ' : '│   '), isLast);
  }
}
const dotCode = buildGraphviz(btree);

console.log(printBTree(btree.root));

console.log(dotCode);

// const N = 100000;

// for (let i = 1; i <= N; i++) {
//   btree.insert(i);
// }

// visitedNodes = 0;
// btree.root.search(N); // or any key

// console.log('Visited nodes:', visitedNodes);
// console.log('Log base t of N:', Math.log(N) / Math.log(16));

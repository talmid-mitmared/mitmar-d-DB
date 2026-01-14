export { insertInTree, insertInPage } from './InsertOperation';
export { searchInTree, searchInPage } from './SearchOperation';
export * from './Page';
import { createPageDebugReport } from './debugger';
import { deleteInTree } from './DeleteOperation';
import { insertInTree } from './InsertOperation';
import { $BtPage, createBtreePage, isPageLeaf, isPageOverflows, isPageUnderflows } from './Page';
import { searchInPage, searchInTree } from './SearchOperation';

class Btree {
  root = createBtreePage({
    recordKeys: [],
    children: [],
    minimumDegree: 3,
  });

  Insertion(queryKey: number) {
    this.root = insertInTree(this.root, queryKey);
  }

  Delete(queryKey: number) {
    console.log('😛, key to delete: ', queryKey);
    this.root = deleteInTree(this.root, queryKey);
    console.log(printBTree(this.root));
    // this.IsTree(this.root, queryKey, 0);
  }

  IsTree(tree: $BtPage, key: number, count: number) {
    if (isPageOverflows(tree) && count) {
      console.warn('The page is overflows');
    }

    if (tree.children.length + 1 === tree.recordKeys.length) {
      console.warn('The children is unbalanced');
    }
    const meta = searchInPage(tree, key);

    if (!isPageLeaf(tree) && isPageUnderflows(tree) && count) {
      console.warn('The page is underflows');
    }

    if (isPageLeaf(tree) || meta == null || meta.index == null) {
      return;
    }

    this.IsTree(tree.children[meta.index], key, count++);
  }
}

const values = [50, 40, 30, 20, 10, 60, 70, 80, 90, 100];

let insertedTree = new Btree();

values.forEach((val) => {
  insertedTree.Insertion(val);
});

//   values.forEach((val) => {
//     console.log(searchAll(insertedTree.root, val));
//   });
const count = 122;

const insertedValues = Array.from({ length: 31 }, () => Math.floor(Math.random() * 100));

for (const val of [
  72, 91, 55, 38, 55, 18, 78, 3, 76, 31, 18, 88, 80, 10, 57, 22, 33, 66, 38, 77, 2, 52, 40, 71, 95,
  6, 16, 45, 36, 47, 5,
]) {
  insertedTree.Insertion(val);
}
insertedTree.Insertion(77.5);

//   https:dreampuf.github.io/GraphvizOnline/?engine=dot
function generateDotFromBTree(node: $BtPage, id = 0): { dot: string; nextId: number } {
  const nodeId = id;
  const numKeys = node.recordKeys.length;

  const labelParts: string[] = [];
  for (let i = 0; i < numKeys; i++) {
    labelParts.push(`<c${i}> | ${node.recordKeys[i]}`);
  }
  labelParts.push(`<c${numKeys}>`);

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

function buildGraphviz(btree: $BtPage) {
  const { dot } = generateDotFromBTree(btree);
  return `digraph BTree {\n  node [shape=record, style=filled, fillcolor=white];\n${dot}}`;
}

export function printBTree(node: $BtPage, prefix = '', isTail = true) {
  console.log(`${prefix}${isTail ? '└── ' : '├── '}[${node.recordKeys.join(', ')}]`);

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const isLast = i === node.children.length - 1;
    printBTree(child, prefix + (isTail ? '    ' : '│   '), isLast);
  }
}

const dotCode = buildGraphviz(insertedTree.root);

generateDotFromBTree(insertedTree.root);

// console.log(dotCode);

// console.log(printBTree(insertedTree.root));
// console.log('🤬', 'start');

// insertedTree.Delete(55);

// insertedTree.Delete(10);

/**
 * 1. Delete on leaf no underflows
 * 2. Delete on leaf but underflows has to borrow from siblings
 * 3. Delete on leaf but underflows has to borrow from siblings but also underflows. Has to merge with parent
 * 4. Delete on parent no underflows(Borrowing from the child won't cause the underflows)
 * 5. Delete on parent underflows but can borrow from child siblings
 * 6. Delete on parent underflows but even cannot borrow from child siblings. Have to pull from parent's parent
 */

const dummy = createBtreePage({
  recordKeys: [],
  children: [],
  minimumDegree: 3,
});

const vals = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  28, 29, 30,
]; //10, 60, 70, 80, 90, 100
let bla = dummy;
vals.forEach((val) => {
  bla = insertInTree(bla, val);
});

vals.forEach((val) => {
  searchInTree(bla, val);
});

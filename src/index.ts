import { BTree, Page } from './core';

// https:dreampuf.github.io/GraphvizOnline/?engine=dot
function generateDotFromBTree(
  node: Page,
  id = 0,
): { dot: string; nextId: number } {
  const nodeId = id;
  const numKeys = node.getRecordKeys.length;

  const labelParts: string[] = [];
  for (let i = 0; i < numKeys; i++) {
    labelParts.push(`<c${i}> | ${node.getRecordKeys[i]}`);
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

function buildGraphviz(btree: BTree) {
  const { dot } = generateDotFromBTree(btree.rootPage);
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

const btree = new BTree(3);
const btree2 = new BTree(3);

[
  108, 151, 243, 256, 333, 450, 36, 45, 72, 79, 63, 81, 90, 101, 111, 114, 117,
].forEach((val) => {
  btree2.Insert(val);
});

[
  108, 151, 243, 256, 333, 450, 36, 45, 72, 79, 63, 81, 90, 101, 111, 114, 117,
].forEach((val) => {
  btree.Insert(val);
});

btree2.Delete(81);
btree2.Delete(79);
btree2.Delete(101);
btree2.Delete(108);
btree2.Delete(256);
btree.Delete(333);

btree.Delete(81);
btree.Delete(79);
btree.Delete(101);
btree.Delete(108);
btree.Delete(256);
btree.Delete(333);
btree.Delete(243);

// const btree3 = new BTree(3);
// [
//   9, 24, 26, 30, 43, 57, 63, 89, 101, 104, 121, 174, 231, 320, 323, 325, 351,
//   352, 408, 421, 438, 442, 465, 557, 561, 577, 593, 604, 623, 645, 675, 682,
//   687, 713, 715, 725, 760, 776, 788, 790, 797, 823, 836, 861, 899, 929, 943,
//   947, 949, 991,
// ].forEach((val) => {
//   btree3.Insert(val);
// });
// console.log(printBTree(btree3.rootPage));

// [687, 593, 111, 465, 352].forEach((val) => {
//   btree3.Delete(val);
// });

// console.log(printBTree(btree3.rootPage));

const dotCode = buildGraphviz(btree);

console.log(printBTree(btree2.rootPage));
console.log(printBTree(btree.rootPage));

generateDotFromBTree(btree.rootPage);
// console.log(dotCode);

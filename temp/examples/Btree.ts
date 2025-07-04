import { BTree, Page } from '../src/core/BTree';

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

const btree = new BTree(2);
[
  50, 20, 70, 10, 60, 30, 80, 90, 100, 110, 5, 95, 85, 15, 25, 35, 45, 55, 65,
  75, 120, 130, 140, 1, 2, 3, 4, 6, 7, 8, 9, 105, 115, 125, 135, 145, 12, 17,
  18, 22, 24, 26, 27, 28, 29, 31, 32, 33, 34, 36, 38, 39, 42, 44, 46, 48, 51,
  53, 56, 58, 61, 63, 66, 68, 71, 73, 76, 78, 81, 83, 86, 88, 91, 93, 96, 98,
].forEach((val) => {
  btree.Insert(val);
});

const dotCode = buildGraphviz(btree);

console.log(printBTree(btree.rootPage));
generateDotFromBTree(btree.rootPage);
console.log(dotCode);

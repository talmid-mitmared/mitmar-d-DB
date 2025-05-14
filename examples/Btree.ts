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
  0, -100, 42, -101, -5, 6, 17, -103, 18, -105, -104, 1000001, 1000002, -120,
  100000003, 1000004, 1000005, 1000006, 1000006, 1000005, 1000005, 1000000,
].forEach((val) => {
  btree.Insert(val);
});

const dotCode = buildGraphviz(btree);

console.log(printBTree(btree.rootPage));
generateDotFromBTree(btree.rootPage);
console.log(dotCode);

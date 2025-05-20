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

const btree = new BTree(2);

[10, 20, 5, 6, 12, 30, 7, 17, 18, 19, 21, 22].forEach((val) => {
  btree.Insert(val);
});

btree.Delete(7);

const dotCode = buildGraphviz(btree);

console.log(printBTree(btree.rootPage));
generateDotFromBTree(btree.rootPage);
console.log(dotCode);
// export function insertElementsInTargetIndex<T>({
//   base,
//   targetIndex,
//   elementsToInsert,
// }: {
//   base: Array<T>;
//   targetIndex: number;
//   elementsToInsert: Array<T>;
// }) {
//   base.splice(targetIndex, 1, ...elementsToInsert);
//   return base;
// }

// export function deleteElementInTargetIndex<T>({
//   base,
//   targetIndex,
// }: {
//   base: Array<T>;
//   targetIndex: number;
// }) {
//   return insertElementsInTargetIndex<T>({
//     base,
//     targetIndex,
//     elementsToInsert: [],
//   });
// }

export { insertInTree, insertInPage } from './InsertOperation';
export { searchInTree, searchInPage } from './SearchOperation';
export * from './Page';

// import { deleteInTree, deleteInTreeV2 } from './DeleteOperation';
// import { insertInTree } from './InsertOperation';
// import { $BtPage, createBtreePage } from './Page';

// class Btree {
//   root = createBtreePage({
//     recordKeys: [],
//     children: [],
//     minimumDegree: 3,
//   });

//   Insertion(queryKey: number) {
//     this.root = insertInTree(this.root, queryKey);
//   }

//   Delete(queryKey: number) {
//     this.root = deleteInTreeV2(this.root, queryKey);
//   }
// }

// const values = [50, 40, 30, 20, 10, 60, 70, 80, 90, 100];

// let insertedTree = new Btree();

// // values.forEach((val) => {
// //   insertedTree.Insertion(val);
// // });

// // values.forEach((val) => {
// //   console.log(searchAll(insertedTree.root, val));
// // });
// const count = 122;

// const insertedValues = Array.from({ length: 31 }, () =>
//   Math.floor(Math.random() * 100),
// );

// for (const val of [
//   72, 91, 55, 38, 55, 18, 78, 3, 76, 31, 18, 88, 80, 10, 57, 22, 33, 66, 38, 77,
//   2, 52, 40, 71, 95, 6, 16, 45, 36, 47, 5,
// ]) {
//   insertedTree.Insertion(val);
// }
// insertedTree.Insertion(77.5);

// // https:dreampuf.github.io/GraphvizOnline/?engine=dot
// function generateDotFromBTree(
//   node: $BtPage,
//   id = 0,
// ): { dot: string; nextId: number } {
//   const nodeId = id;
//   const numKeys = node.recordKeys.length;

//   const labelParts: string[] = [];
//   for (let i = 0; i < numKeys; i++) {
//     labelParts.push(`<c${i}> | ${node.recordKeys[i]}`);
//   }
//   labelParts.push(`<c${numKeys}>`);

//   let dot = `  node${nodeId} [label="${labelParts.join(' | ')}", shape=record];\n`;
//   let nextId = id + 1;

//   for (let i = 0; i < node.children.length; i++) {
//     const child = node.children[i];
//     const childId = nextId;
//     const childResult = generateDotFromBTree(child, childId);
//     dot += childResult.dot;
//     dot += `  node${nodeId}:c${i} -> node${childId};\n`;
//     nextId = childResult.nextId;
//   }

//   return { dot, nextId };
// }

// function buildGraphviz(btree: $BtPage) {
//   const { dot } = generateDotFromBTree(btree);
//   return `digraph BTree {\n  node [shape=record, style=filled, fillcolor=white];\n${dot}}`;
// }

// export function printBTree(node: $BtPage, prefix = '', isTail = true) {
//   console.log(
//     `${prefix}${isTail ? '└── ' : '├── '}[${node.recordKeys.join(', ')}]`,
//   );

//   for (let i = 0; i < node.children.length; i++) {
//     const child = node.children[i];
//     const isLast = i === node.children.length - 1;
//     printBTree(child, prefix + (isTail ? '    ' : '│   '), isLast);
//   }
// }

// const dotCode = buildGraphviz(insertedTree.root);

// generateDotFromBTree(insertedTree.root);

// console.log(dotCode);
// console.log(printBTree(insertedTree.root));

// for (const val of [80, 88, 2]) {
//   insertedTree.Delete(val);
// }
// console.log(printBTree(insertedTree.root));
// insertedTree.Delete(45);
// console.log(printBTree(insertedTree.root));
// insertedTree.Delete(47);
// console.log(printBTree(insertedTree.root));

// import { describe, it, expect } from '@jest/globals';
// import { $BtPage, createBtreePage } from '../Page';
// import { deleteInTreeV2 } from '../DeleteOperation';
// import { searchInTree } from '../SearchOperation';
// import { insertInTree } from '../InsertOperation';

// describe('BTree Deletion – Leaf Node Only', () => {
//   const MINIMUM_DEGREE = 2 as const;

//   let root: $BtPage;

//   beforeEach(() => {
//     root = createBtreePage({
//       recordKeys: [],
//       children: [],
//       minimumDegree: MINIMUM_DEGREE,
//     });
//   });

//   it('should insert and then delete a leaf node key successfully', () => {
//     const values = [10, 20, 5];
//     let insertedTree = root;

//     values.forEach((val) => {
//       insertedTree = insertInTree(insertedTree, val);
//     });

//     expect(searchInTree(deleteInTreeV2(insertedTree, 5), 5)).toBe(null);
//     expect(searchInTree(deleteInTreeV2(insertedTree, 10), 10)).toBe(null);

//     expect(searchInTree(insertedTree, 20)).toBe(20);
//   });

//   it('should borrow from left sibling when right underflows', () => {
//     const values = [10, 20, 5, 6, 12, 30, 7, 17, 18, 19, 21, 22];
//     let insertedTree = root;

//     values.forEach((val) => {
//       insertedTree = insertInTree(insertedTree, val);
//     });

//     /**
//      * The tree structure now should have two children under root after splits:
//      * [10] in parent
//      * [5, 6, 7] in left, [12] in right (or similar structure depending on split)
//      */
//     expect(searchInTree(deleteInTreeV2(insertedTree, 12), 12)).toBe(null);
//     expect(searchInTree(insertedTree, 5)).toBe(5);
//     expect(searchInTree(insertedTree, 6)).toBe(6);
//     expect(searchInTree(insertedTree, 7)).toBe(7);

//     console.dir(insertedTree, { depth: null });

//     // expect(btree.rootPage.Search(12)).toBe(false);
//   });

//   // it('should rebalance after deleting a leaf key that causes underflow', () => {
//   //   const keys = [10, 20, 5, 6];
//   //   keys.forEach((k) => btree.Insert(k));

//   //   btree.Delete(5);
//   //   btree.Delete(6);

//   //   expect(btree.rootPage.Search(5)).toBe(false);
//   //   expect(btree.rootPage.Search(6)).toBe(false);
//   //   expect(btree.rootPage.Search(10)).toBe(true);
//   //   expect(btree.rootPage.Search(20)).toBe(true);
//   // });

//   // it('should do nothing when trying to delete a non-existent key', () => {
//   //   const keys = [10, 20, 30];
//   //   keys.forEach((k) => btree.Insert(k));

//   //   btree.Delete(40);

//   //   expect(btree.rootPage.Search(10)).toBe(true);
//   //   expect(btree.rootPage.Search(20)).toBe(true);
//   //   expect(btree.rootPage.Search(30)).toBe(true);
//   // });

//   // it('should borrow from left sibling when right underflows', () => {
//   //   const keys = [10, 20, 5, 6, 12, 30, 7, 17, 18, 19, 21, 22];
//   //   keys.forEach((k) => btree.Insert(k));

//   //   btree.Delete(5);
//   //   btree.Delete(6);

//   //   expect(btree.rootPage.Search(5)).toBe(false);
//   //   expect(btree.rootPage.Search(6)).toBe(false);
//   //   expect(btree.rootPage.Search(7)).toBe(true);

//   //   expect(btree.rootPage.Search(12)).toBe(true);
//   // });
// });

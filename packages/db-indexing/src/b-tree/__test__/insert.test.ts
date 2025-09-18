import { describe, it, expect } from '@jest/globals';
import { $BtPage, createBtreePage } from '../Page';
import { insertInPage, insertInTree } from '../InsertOperation';
import { searchInPage, searchInTree } from '../SearchOperation';

describe('BTree Insertion and Search', () => {
  const MINIMUM_DEGREE = 2 as const;

  let root: $BtPage;

  beforeEach(() => {
    root = createBtreePage({
      recordKeys: [],
      children: [],
      minimumDegree: MINIMUM_DEGREE,
    });
  });

  it('should insert and search single value correctly', () => {
    const queryKey = 10 as const;

    const afterInsert = insertInPage(root, 10);

    expect(searchInPage(afterInsert, queryKey).value).toBe(queryKey);
    expect(searchInPage(afterInsert, 12).value).toBe(null);
  });

  it('should insert multiple values and structure remains valid', () => {
    const values = [50, 40, 30, 20, 10, 60, 70, 80, 90, 100];
    let insertedTree = root;

    values.forEach((val) => {
      insertedTree = insertInPage(root, val);
    });

    values.forEach((val) => {
      expect(searchInTree(insertedTree, val)).not.toBeNull();
    });
  });

  it('should not insert duplicates', () => {
    let insertedTree = root;
    insertedTree = insertInPage(root, 15);
    insertedTree = insertInPage(root, 15);

    expect(searchInPage(insertedTree, 15).value).toBe(15);
  });

  it('should handle large number of insertions and search correctly', () => {
    const values = new Array(200).map((val, index) => index);

    let insertedTree = root;

    values.forEach((val) => {
      insertedTree = insertInTree(root, val);
    });

    values.forEach((val) => {
      expect(searchInTree(insertedTree, val).found).toBe(true);
    });

    expect(searchInTree(insertedTree, 201)).toBe(null);
  });

  it('should promote primaryKey key when a child page is full', () => {
    const values = [0, -100, 42, -101];
    let insertedTree = root;
    // -101, -100, 0, 42
    values.forEach((val) => (insertedTree = insertInTree(root, val)));

    expect(insertedTree.recordKeys[0]).toBe(-100);
  });

  it('should promote the primary key when the root page is full', () => {
    let insertedTree = root;
    const values = [0, -100, 42, -101, -5, 6, 17, -103, 18, -105, -104];

    values.forEach((val) => (insertedTree = insertInTree(root, val)));

    expect(insertedTree.recordKeys[0]).toBe(0);

    const leftChildren = insertedTree.children[0].recordKeys;
    const rightChildren = insertedTree.children[1].recordKeys;

    expect(JSON.stringify(leftChildren)).toBe(JSON.stringify([-104, -100]));
    expect(JSON.stringify(rightChildren)).toBe(JSON.stringify([42]));
  });
});

import { describe, it, expect } from '@jest/globals';
import { BTree } from '../BTree';

describe('BTree Insertion and Search', () => {
  it('should insert and search single value correctly', () => {
    const btree = new BTree(2);
    btree.Insert(10);
    expect(btree.rootPage.Search(10)).toBe(10);
    expect(btree.rootPage.Search(20)).toBe(null);
  });

  it('should insert multiple values and structure remains valid', () => {
    const btree = new BTree(2);
    const values = [50, 40, 30, 20, 10, 60, 70, 80, 90, 100];
    values.forEach((val) => btree.Insert(val));
    values.forEach((val) => {
      expect(btree.rootPage.Search(val)).toBe(val);
    });
    expect(btree.rootPage.Search(999)).toBe(null);
  });

  it('should not insert duplicates', () => {
    const btree = new BTree(2);
    btree.Insert(15);
    btree.Insert(15);
    expect(btree.rootPage.Search(15)).toBe(true);
  });

  it('should handle large number of insertions and search correctly', () => {
    const btree = new BTree(4);
    const count = 200;
    for (let i = 1; i <= count; i++) {
      btree.Insert(i);
    }
    for (let i = 1; i <= count; i++) {
      expect(btree.rootPage.Search(i)).toBe(i);
    }
    expect(btree.rootPage.Search(201)).toBe(null);
  });

  it('should promote primaryKey key when a child page is full', () => {
    const degree = 2;
    const btree = new BTree(degree);
    const values = [0, -100, 42, -101];

    values.forEach((val) => btree.Insert(val));

    expect(btree.rootPage.getRecordKeys[0]).toBe(0);
  });

  it('should promote the primary key when the root page is full', () => {
    const degree = 2;
    const btree = new BTree(degree);
    const values = [0, -100, 42, -101, -5, 6, 17, -103, 18, -105, -104];

    values.forEach((val) => btree.Insert(val));

    expect(btree.rootPage.getRecordKeys[0]).toBe(0);

    const leftChildren = btree.rootPage.children[0].getRecordKeys;
    const rightChildren = btree.rootPage.children[1].getRecordKeys;

    expect(JSON.stringify(leftChildren)).toBe(JSON.stringify([-103, -100]));
    expect(JSON.stringify(rightChildren)).toBe(JSON.stringify([17]));
  });
});

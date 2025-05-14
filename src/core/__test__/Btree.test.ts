import { describe, it, expect } from 'vitest';
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
    expect(btree.rootPage.Search(15)).toBe(15);
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

  it('should search correctly in deep tree', () => {
    const btree = new BTree(3);
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((val) => btree.Insert(val));
    expect(btree.rootPage.Search(5)).toBe(5);
    expect(btree.rootPage.Search(10)).toBe(10);
    expect(btree.rootPage.Search(11)).toBe(null);
  });
});

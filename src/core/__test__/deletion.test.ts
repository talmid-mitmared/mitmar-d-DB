import { describe, it, expect } from '@jest/globals';
import { BTree } from '../BTree';

describe('BTree Deletion – Leaf Node Only', () => {
  let btree: BTree;

  beforeEach(() => {
    btree = new BTree(2);
  });

  // it('should insert and then delete a leaf node key successfully', () => {
  //   btree.Insert(10);
  //   btree.Insert(20);
  //   btree.Insert(5);

  //   expect(btree.rootPage.Search(5)).toBe(true);

  //   btree.Delete(5);

  //   expect(btree.rootPage.Search(5)).toBe(false);
  //   expect(btree.rootPage.Search(10)).toBe(true);
  //   expect(btree.rootPage.Search(20)).toBe(true);
  // });

  // it('should delete multiple leaf keys and preserve others', () => {
  //   const keys = [10, 20, 5, 15, 25];
  //   keys.forEach((k) => btree.Insert(k));

  //   btree.Delete(5);
  //   btree.Delete(15);

  //   expect(btree.rootPage.Search(5)).toBe(false);
  //   expect(btree.rootPage.Search(15)).toBe(false);

  //   expect(btree.rootPage.Search(10)).toBe(true);
  //   expect(btree.rootPage.Search(20)).toBe(true);
  //   expect(btree.rootPage.Search(25)).toBe(true);
  // });

  it('should rebalance after deleting a leaf key that causes underflow', () => {
    const keys = [10, 20, 5, 6];
    keys.forEach((k) => btree.Insert(k));

    btree.Delete(5);
    btree.Delete(6);

    expect(btree.rootPage.Search(5)).toBe(false);
    expect(btree.rootPage.Search(6)).toBe(false);
    expect(btree.rootPage.Search(10)).toBe(true);
    expect(btree.rootPage.Search(20)).toBe(true);
  });

  it('should do nothing when trying to delete a non-existent key', () => {
    const keys = [10, 20, 30];
    keys.forEach((k) => btree.Insert(k));

    btree.Delete(40);

    expect(btree.rootPage.Search(10)).toBe(true);
    expect(btree.rootPage.Search(20)).toBe(true);
    expect(btree.rootPage.Search(30)).toBe(true);
  });

  it('should borrow from left sibling when right underflows', () => {
    const keys = [10, 20, 5, 6, 12, 30, 7, 17, 18, 19, 21, 22];
    keys.forEach((k) => btree.Insert(k));

    /**
     * The tree structure now should have two children under root after splits:
     * [10] in parent
     * [5, 6, 7] in left, [12] in right (or similar structure depending on split)
     */
    btree.Delete(12);

    expect(btree.rootPage.Search(5)).toBe(true);
    expect(btree.rootPage.Search(6)).toBe(true);
    expect(btree.rootPage.Search(7)).toBe(true);

    expect(btree.rootPage.Search(12)).toBe(false);
  });

  it('should borrow from left sibling when right underflows', () => {
    const keys = [10, 20, 5, 6, 12, 30, 7, 17, 18, 19, 21, 22];
    keys.forEach((k) => btree.Insert(k));

    btree.Delete(5);
    btree.Delete(6);

    expect(btree.rootPage.Search(5)).toBe(false);
    expect(btree.rootPage.Search(6)).toBe(false);
    expect(btree.rootPage.Search(7)).toBe(true);

    expect(btree.rootPage.Search(12)).toBe(true);
  });
});

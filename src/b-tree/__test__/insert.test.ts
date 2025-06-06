import { describe, it, expect } from '@jest/globals';
import { PageCore } from '../Pages';
import { insert, insertAll } from '../Insert';
import { search, searchAll } from '../Search';

describe('BTree Insertion and Search', () => {
  const MINIMUM_DEGREE = 2 as const;

  let root: PageCore;
  let leaf1: PageCore, leaf2: PageCore, leaf3: PageCore;

  beforeEach(() => {
    leaf1 = new PageCore(MINIMUM_DEGREE, [5, 10]);
    leaf2 = new PageCore(MINIMUM_DEGREE, [20, 25]);
    leaf3 = new PageCore(MINIMUM_DEGREE, [35, 40]);
    root = new PageCore(MINIMUM_DEGREE, [15, 30], [leaf1, leaf2, leaf3]);
  });
  it('should insert and search single value correctly', () => {
    const btree = new PageCore(2);
    const queryKey = 10 as const;

    const afterInsert = insert(btree, 10);

    expect(search(afterInsert, queryKey)).toBe(queryKey);
    expect(search(afterInsert, 12)).toBe(null);
  });

  it('should insert multiple values and structure remains valid', () => {
    const btree = new PageCore(2);
    const values = [50, 40, 30, 20, 10, 60, 70, 80, 90, 100];

    let insertedTree: PageCore;

    values.forEach((val) => (insertedTree = insertAll(btree, val)));

    values.forEach((val) => {
      expect(searchAll(insertedTree, val)).toBe(val);
    });
  });

  // it('should not insert duplicates', () => {
  //   const btree = new PageCore(2);
  //   btree.Insert(15);
  //   btree.Insert(15);
  //   expect(btree.rootPage.Search(15)).toBe(true);
  // });

  // it('should handle large number of insertions and search correctly', () => {
  //   const btree = new BTree(4);
  //   const count = 200;
  //   for (let i = 1; i <= count; i++) {
  //     btree.Insert(i);
  //   }
  //   for (let i = 1; i <= count; i++) {
  //     expect(btree.rootPage.Search(i)).toBe(true);
  //   }
  //   expect(btree.rootPage.Search(201)).toBe(false);
  // });

  // it('should promote primaryKey key when a child page is full', () => {
  //   const degree = 2;
  //   const btree = new BTree(degree);
  //   const values = [0, -100, 42, -101];

  //   values.forEach((val) => btree.Insert(val));

  //   expect(btree.rootPage.getRecordKeys[0]).toBe(0);
  // });

  // it('should promote the primary key when the root page is full', () => {
  //   const degree = 2;
  //   const btree = new BTree(degree);
  //   const values = [0, -100, 42, -101, -5, 6, 17, -103, 18, -105, -104];

  //   values.forEach((val) => btree.Insert(val));

  //   expect(btree.rootPage.getRecordKeys[0]).toBe(0);

  //   const leftChildren = btree.rootPage.children[0].getRecordKeys;
  //   const rightChildren = btree.rootPage.children[1].getRecordKeys;

  //   expect(JSON.stringify(leftChildren)).toBe(JSON.stringify([-103, -100]));
  //   expect(JSON.stringify(rightChildren)).toBe(JSON.stringify([17]));
  // });
});

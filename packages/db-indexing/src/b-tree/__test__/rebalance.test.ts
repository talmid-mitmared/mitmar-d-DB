import { describe, it, expect } from '@jest/globals';
import { createBtreePage, isPageLeaf } from '../Page';
import { searchInPage, searchInTree } from '../SearchOperation';
import { insertInTree } from '../InsertOperation';
import { getSiblingIndices } from '../rebalance';

describe('getSiblingIndices', () => {
  class Btree {
    root = createBtreePage({
      recordKeys: [],
      children: [],
      minimumDegree: 3,
    });

    Insertion(queryKey: number) {
      this.root = insertInTree(this.root, queryKey);
    }
  }

  let btreeInstance: Btree;

  beforeEach(() => {
    btreeInstance = new Btree();

    for (const val of [
      50, 40, 30, 20, 10, 60, 70, 80, 90, 100, 72, 91, 55, 38, 55, 18, 78, 3, 76, 31, 18, 88, 80,
      10, 57, 22, 33, 66, 38, 77, 2, 52, 40, 71, 95, 6, 16, 45, 36, 47, 5,
    ]) {
      btreeInstance.Insertion(val);
    }
  });

  it('returns correct indices for a leftmost LEAF key', () => {
    const TARGET_QUERY_KEY = 5 as const;

    const { currentPage, parentPage } = searchInTree(btreeInstance.root, TARGET_QUERY_KEY);

    const indices = getSiblingIndices(TARGET_QUERY_KEY, parentPage!);

    const { index } = searchInPage(parentPage!, TARGET_QUERY_KEY);

    const isMostLeft = index === 0 && isPageLeaf(currentPage!);

    expect(isMostLeft).toBe(true);
    expect(indices?.leftSiblingIndex).toBe(null);
    expect(indices?.rightSiblingIndex).toBe(index! + 1);
  });

  it('returns correct indices for a rightmost LEAF key', () => {
    const TARGET_QUERY_KEY = 55 as const;

    const { currentPage, parentPage } = searchInTree(btreeInstance.root, TARGET_QUERY_KEY);

    const indices = getSiblingIndices(TARGET_QUERY_KEY, parentPage!);

    const { index } = searchInPage(parentPage!, TARGET_QUERY_KEY);

    const isMostRight =
      index === (parentPage?.children.length ?? 0) - 1 && isPageLeaf(currentPage!);

    expect(isMostRight).toBe(true);
    expect(indices?.leftSiblingIndex).toBe(4);
    expect(indices?.rightSiblingIndex).toBe(null);
  });

  it('returns correct indices for a MIDDLE LEAF key', () => {
    const TARGET_QUERY_KEY = 22 as const;
    const { parentPage } = searchInTree(btreeInstance.root, TARGET_QUERY_KEY);
    const { index } = searchInPage(parentPage!, TARGET_QUERY_KEY);

    const indices = getSiblingIndices(TARGET_QUERY_KEY, parentPage!);

    expect(indices?.leftSiblingIndex).toBe(index! - 1);
    expect(indices?.rightSiblingIndex).toBe(index! + 1);
  });

  it('returns correct indices for an INTERNAL key with only a RIGHT sibling', () => {
    const TARGET_QUERY_KEY = 40 as const;
    const { parentPage } = searchInTree(btreeInstance.root, TARGET_QUERY_KEY);
    const { index } = searchInPage(parentPage!, TARGET_QUERY_KEY);

    const indices = getSiblingIndices(TARGET_QUERY_KEY, parentPage!);

    expect(indices?.leftSiblingIndex).toBe(null);
    expect(indices?.rightSiblingIndex).toBe(index! + 1);
  });

  it('returns correct indices for an INTERNAL key with only a LEFT sibling', () => {
    const TARGET_QUERY_KEY = 72 as const;
    const { parentPage } = searchInTree(btreeInstance.root, TARGET_QUERY_KEY);
    const { index } = searchInPage(parentPage!, TARGET_QUERY_KEY);

    const indices = getSiblingIndices(TARGET_QUERY_KEY, parentPage!);

    expect(indices?.leftSiblingIndex).toBe(index! - 1);
    expect(indices?.rightSiblingIndex).toBe(null);
  });
});

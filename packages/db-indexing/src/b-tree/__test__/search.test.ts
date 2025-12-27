import { $BtPage, createBtreePage } from '../Page';
import { searchInPage, searchInTree } from '../SearchOperation';

describe('B-tree Iterator', () => {
  const MINIMUM_DEGREE = 2 as const;

  let root: $BtPage;

  beforeEach(() => {
    root = createBtreePage({
      recordKeys: [15, 30],
      children: [
        createBtreePage({
          recordKeys: [5, 10],
          children: [],
          minimumDegree: MINIMUM_DEGREE,
        }),
        createBtreePage({
          recordKeys: [20, 25],
          children: [],
          minimumDegree: MINIMUM_DEGREE,
        }),
        createBtreePage({
          recordKeys: [35, 40],
          children: [],
          minimumDegree: MINIMUM_DEGREE,
        }),
      ],
      minimumDegree: MINIMUM_DEGREE,
    });
  });

  it('should return correct index if key is found in root page', () => {
    const TARGET_KEY = 15 as const;
    const searchedValue = searchInPage(root, TARGET_KEY);

    expect(searchedValue?.index).toBe(0);
    expect(searchedValue?.value).toBe(TARGET_KEY);
  });

  it('should return correct index if key is found in child leftmost page', () => {
    const TARGET_KEY = 10 as const;
    const { currentPage, parentPage } = searchInTree(root, TARGET_KEY);

    expect(currentPage).not.toBeNull();
    expect(parentPage).not.toBeNull();
  });

  it('should return correct index if key is found in child middle page', () => {
    const TARGET_KEY = 20 as const;
    const { currentPage, parentPage } = searchInTree(root, TARGET_KEY);

    expect(currentPage).not.toBeNull();
    expect(parentPage).not.toBeNull();
  });

  it('should return correct index if key is found in child rightmost page', () => {
    const TARGET_KEY = 35 as const;
    const { currentPage, parentPage } = searchInTree(root, TARGET_KEY);

    expect(currentPage).not.toBeNull();
    expect(parentPage).not.toBeNull();
  });

  it('should return null when reaching a leaf and key not found', () => {
    const TARGET_KEY = 222 as const;
    const { isQueryKeyExists } = searchInTree(root, TARGET_KEY);
    expect(isQueryKeyExists).toBe(false);
  });
});

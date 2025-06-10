import { $BtPage, createBtreePage } from '../Page';
import { search, searchAll } from '../SearchAction';

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
    const queryKey = 15 as const;
    const searchedValue = search(root, queryKey);

    expect(searchedValue?.index).toBe(0);
    expect(searchedValue?.value).toBe(queryKey);
  });

  it('should return correct index if key is found in child leftmost page', () => {
    const queryKey = 10 as const;
    const value = searchAll(root, queryKey);
    expect(value).toBe(queryKey);
  });

  it('should return correct index if key is found in child middle page', () => {
    const queryKey = 20 as const;
    const value = searchAll(root, queryKey);
    expect(value).toBe(queryKey);
  });

  it('should return correct index if key is found in child rightmost page', () => {
    const queryKey = 35 as const;
    const value = searchAll(root, queryKey);
    expect(value).toBe(queryKey);
  });

  it('should return null when reaching a leaf and key not found', () => {
    const queryKey = 222 as const;

    const value = searchAll(root, queryKey);
    expect(value).toBe(null);
  });
});

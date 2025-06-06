import { getIterator } from '../Iterator';
import { $BtPage, createBtreePage } from '../Page';
import { searchInIterator } from '../Search';

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
    const searchFn = searchInIterator(root, queryKey);
    const iterator = getIterator(searchFn);

    const index = iterator.next();

    expect(index).toBe(0);
    expect(iterator.value()).toBe(queryKey);
    expect(iterator.current()).toEqual(index);
    expect(iterator.offset()).toBe(0);
  });

  it('should return correct index if key is found in child leftmost page', () => {
    const queryKey = 10 as const;

    const searchFn = searchInIterator(root, queryKey);
    const iterator = getIterator(searchFn);

    const childIndex = iterator.next();

    expect(childIndex).toBe(0);
    expect(iterator.value()).toBe(null);
    expect(iterator.current()).toEqual(childIndex);

    const targetIndex = iterator.next();

    expect(targetIndex).toBe(1);
    expect(iterator.value()).toBe(queryKey);
    expect(iterator.current()).toEqual(targetIndex);
    expect(iterator.offset()).toBe(1);
  });

  it('should return correct index if key is found in child middle page', () => {
    const queryKey = 20 as const;
    const searchFn = searchInIterator(root, queryKey);
    const iterator = getIterator(searchFn);

    const childIndex = iterator.next();

    expect(childIndex).toBe(1);
    expect(iterator.value()).toBe(null);
    expect(iterator.current()).toEqual(childIndex);

    const targetIndex = iterator.next();

    expect(targetIndex).toBe(0);
    expect(iterator.value()).toBe(queryKey);
    expect(iterator.current()).toEqual(targetIndex);
    expect(iterator.offset()).toBe(1);
  });

  it('should return correct index if key is found in child rightmost page', () => {
    const queryKey = 35 as const;
    const searchFn = searchInIterator(root, queryKey);
    const iterator = getIterator(searchFn);

    const childIndex = iterator.next();

    expect(childIndex).toBe(2);
    expect(iterator.value()).toBe(null);
    expect(iterator.current()).toEqual(childIndex);

    const targetIndex = iterator.next();

    expect(targetIndex).toBe(0);
    expect(iterator.value()).toBe(queryKey);
    expect(iterator.current()).toEqual(targetIndex);
    expect(iterator.offset()).toBe(1);
  });

  it('should return correct child index if key is not in page', () => {
    const searchFn = searchInIterator(root, 22);
    const iterator = getIterator(searchFn);

    const index = iterator.next();

    expect(index).toBe(1);
    expect(iterator.value()).toBe(null);
    expect(iterator.current()).toBe(1);
  });

  it('should return null when reaching a leaf and key not found', () => {
    const searchFn = searchInIterator(root, 22);
    const iterator = getIterator(searchFn);

    iterator.next();
    iterator.next();

    expect(iterator.value()).toBe(null);
  });
});

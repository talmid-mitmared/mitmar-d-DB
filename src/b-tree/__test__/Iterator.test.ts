import { BtreeIterator } from '../Iterator';
import { PageCore } from '../Pages';

describe('B-tree Iterator', () => {
  const MINIMUM_DEGREE = 2 as const;

  let root: PageCore;
  let leaf1: PageCore, leaf2: PageCore, leaf3: PageCore;

  beforeEach(() => {
    leaf1 = new PageCore(MINIMUM_DEGREE, [5, 10]);
    leaf2 = new PageCore(MINIMUM_DEGREE, [20, 25]);
    leaf3 = new PageCore(MINIMUM_DEGREE, [35, 40]);
    root = new PageCore(MINIMUM_DEGREE, [15, 30], [leaf1, leaf2, leaf3]);
  });

  it('should return correct index if key is found in root page', () => {
    const iterator = new BtreeIterator();
    const queryKey = 15 as const;

    const index = iterator.next(root, queryKey);

    expect(index).toBe(0);
    expect(iterator.value()).toBe(queryKey);
    expect(iterator.current()).toEqual(index);
    expect(iterator.offset()).toBe(0);
  });

  it('should return correct index if key is found in child leftmost page', () => {
    const iterator = new BtreeIterator();
    const queryKey = 10 as const;

    const childIndex = iterator.next(root, queryKey);

    expect(childIndex).toBe(0);
    expect(iterator.value()).toBe(null);
    expect(iterator.current()).toEqual(childIndex);

    const child = root.children[childIndex as number];

    const targetIndex = iterator.next(child, queryKey);

    expect(targetIndex).toBe(1);
    expect(iterator.value()).toBe(queryKey);
    expect(iterator.current()).toEqual(targetIndex);
    expect(iterator.offset()).toBe(1);
  });

  it('should return correct index if key is found in child middle page', () => {
    const iterator = new BtreeIterator();
    const queryKey = 20 as const;

    const childIndex = iterator.next(root, queryKey);

    expect(childIndex).toBe(1);
    expect(iterator.value()).toBe(null);
    expect(iterator.current()).toEqual(childIndex);

    const child = root.children[childIndex as number];

    const targetIndex = iterator.next(child, queryKey);

    expect(targetIndex).toBe(0);
    expect(iterator.value()).toBe(queryKey);
    expect(iterator.current()).toEqual(targetIndex);
    expect(iterator.offset()).toBe(1);
  });

  it('should return correct index if key is found in child rightmost page', () => {
    const iterator = new BtreeIterator();
    const queryKey = 35 as const;

    const childIndex = iterator.next(root, queryKey);

    expect(childIndex).toBe(2);
    expect(iterator.value()).toBe(null);
    expect(iterator.current()).toEqual(childIndex);

    const child = root.children[childIndex as number];
    const targetIndex = iterator.next(child, queryKey);

    expect(targetIndex).toBe(0);
    expect(iterator.value()).toBe(queryKey);
    expect(iterator.current()).toEqual(targetIndex);
    expect(iterator.offset()).toBe(1);
  });

  it('should return correct child index if key is not in page', () => {
    const iterator = new BtreeIterator();

    const index = iterator.next(root, 22);
    expect(index).toBe(1);
    expect(iterator.value()).toBe(null);
    expect(iterator.current()).toBe(1);
  });

  it('should return null when reaching a leaf and key not found', () => {
    const iterator = new BtreeIterator();

    const childIndex = iterator.next(root, 22);
    iterator.next(root.children[childIndex!] as PageCore, 22);

    expect(iterator.value()).toBe(null);
  });
});

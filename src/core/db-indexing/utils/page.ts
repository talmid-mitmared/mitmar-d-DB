export function getNextPageIndex<T>(lists: T[], query: T) {
  const index = lists.findIndex((element) => query < element);

  if (index === -1) {
    return lists.length;
  }

  return index;
}

export function getRelativeIndex(childIndex: number, parentKeyLength: number) {
  const targetIndex =
    childIndex === parentKeyLength ? childIndex - 1 : childIndex + 1;

  return targetIndex;
}

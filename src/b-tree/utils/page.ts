export function getNextPageIndex<T>(lists: T[], query: T) {
  const index = lists.findIndex((element) => query < element);

  if (index === -1) {
    return lists.length;
  }

  return index;
}

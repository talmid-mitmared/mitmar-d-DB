export function sliceArrayToTargetIndex<T>({
  lists,
  startIndex = 0,
  destIndex,
}: {
  lists: Array<T>;
  startIndex?: number;
  destIndex: number;
}) {
  const leftKeys = lists.slice(startIndex, destIndex);
  return leftKeys;
}

export function insertElementInArray<T>({
  baseLists,
  indexToInsert,
  elementsToInsert,
}: {
  baseLists: Array<T>;
  indexToInsert: number;
  elementsToInsert: Array<T>;
}) {
  baseLists.splice(indexToInsert, 1, ...elementsToInsert);
  return baseLists;
}

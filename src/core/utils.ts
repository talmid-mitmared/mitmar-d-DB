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
  deleteCount = 1,
  elementsToInsert,
}: {
  baseLists: Array<T>;
  indexToInsert: number;
  deleteCount?: number;
  elementsToInsert: Array<T>;
}) {
  baseLists.splice(indexToInsert, deleteCount, ...elementsToInsert);
  return baseLists;
}

export function deleteElementInArray<T>({
  baseLists,
  targetValue,
}: {
  baseLists: Array<T>;
  targetValue: number;
}) {
  return baseLists.filter((element) => targetValue !== element);
}

export function findTargetIndex<T>(lists: Array<T>, targetValue: T) {
  const index = lists?.findIndex((element) => targetValue === element);

  if (index === -1) {
    return null;
  }

  return index;
}

import { $BtPage } from '../Page';
import { searchInPage } from '../SearchOperation';

export function getSiblingIndices({
  queryKey,
  parentPage,
}: {
  queryKey: number;
  parentPage: $BtPage;
}) {
  const { index: currentIndex } = searchInPage(parentPage, queryKey);

  if (currentIndex == null) return null;

  const isLeftMost = currentIndex === 0;
  const isRightMost = currentIndex === parentPage.children.length - 1;

  if (isLeftMost) {
    return {
      leftSiblingIndex: null,
      currentIndex,
      rightSiblingIndex: currentIndex + 1,
    };
  }

  if (isRightMost) {
    return {
      leftSiblingIndex: currentIndex - 1,
      currentIndex,
      rightSiblingIndex: null,
    };
  }

  return {
    leftSiblingIndex: currentIndex - 1,
    currentIndex,
    rightSiblingIndex: currentIndex + 1,
  };
}

export function getSiblingChildPages(props: { queryKey: number; parentPage: $BtPage }) {
  const indices = getSiblingIndices(props);

  const leftChildPage = props.parentPage.children[indices?.leftSiblingIndex ?? -1];
  const rightChildPage = props.parentPage.children[indices?.rightSiblingIndex ?? -1];

  return {
    left: {
      page: leftChildPage,
      index: indices?.leftSiblingIndex,
    },
    right: {
      page: rightChildPage,
      index: indices?.rightSiblingIndex,
    },
    baseIndex: indices?.currentIndex,
  };
}

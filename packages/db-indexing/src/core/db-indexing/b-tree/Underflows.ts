import { $BtPage, isPageWillUnderflows } from './Page';
import { searchInPage } from './SearchOperation';

export function getChildSiblingIndexs(childIndex: number | null, page: $BtPage) {
  const isLeftMost = childIndex === 0;
  const isRightMost = childIndex === page.children.length - 1;

  // Edge case: node is the leftmost child → only right sibling exists
  if (isLeftMost) {
    return {
      leftSiblingIndex: null,
      rightSiblingIndex: childIndex + 1,
    };
  }

  // Edge case: node is the rightmost child → only left sibling exists
  if (isRightMost) {
    return {
      leftSiblingIndex: childIndex - 1,
      rightSiblingIndex: null,
    };
  }

  // Middle child: both left and right siblings are available
  return {
    leftSiblingIndex: childIndex! - 1,
    rightSiblingIndex: childIndex! + 1,
  };
}

export function isSiblingWillUnderflows(parentPage: $BtPage, index: number | null) {
  if (index == null) return true;

  const sibling = parentPage.children[index];

  return isPageWillUnderflows(sibling);
}

export function isBothSiblingsWillUnderflows(queryKey: number, page: $BtPage) {
  const { index: currentIndex } = searchInPage(page, queryKey);

  const { leftSiblingIndex, rightSiblingIndex } = getChildSiblingIndexs(currentIndex, page);

  return (
    isPageWillUnderflows(page?.children[leftSiblingIndex ?? -1]) &&
    isPageWillUnderflows(page?.children[rightSiblingIndex ?? -1])
  );
}

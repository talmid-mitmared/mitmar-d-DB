import { extractKeyInPage } from '../DeleteOperation';
import { $BtPage } from '../Page';

export function deleteKeyInChild(
  childPageIndex: number,
  childKeyIndex: number,
  parentPage: $BtPage,
) {
  const { value: deletedKey } = extractKeyInPage(
    childKeyIndex,
    parentPage.children[childPageIndex],
  );

  return {
    deletedKey,
    parentPage,
  };
}

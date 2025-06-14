/**
 * Copyright (c) 2025 resetmerlin
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @tsdoc
 */

export function getNextPageIndex<T>(lists: T[], query: T) {
  const index = lists.findIndex((element) => query < element);

  if (index === -1) {
    return lists.length;
  }

  return index;
}

/**
 * Copyright (c) 2025 resetmerlin
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @tsdoc
 */

import { getIterator } from './Iterator';
import { PageCore, RecordKey } from './Pages';

export function searchAll(page: PageCore, queryKey: RecordKey): number | null {
  const iterator = getIterator();

  const nexIndex = iterator.next(page, queryKey);

  if (iterator.value() === queryKey) {
    return iterator.value();
  }

  const nextPage = page.children[nexIndex ?? 0];

  if (nextPage == null) return null;

  return searchAll(nextPage, queryKey);
}

export function search(page: PageCore, queryKey: RecordKey): number | null {
  const iterator = getIterator();

  iterator.next(page, queryKey);

  return iterator.value();
}

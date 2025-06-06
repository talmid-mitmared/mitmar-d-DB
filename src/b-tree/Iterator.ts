/**
 * Copyright (c) 2025 resetmerlin
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @tsdoc
 */

import { getNextPageIndex } from '../index-utils';
import { $IteratorNode, createIteratorNode } from './IteratorMetadata';
import { PageCore, RecordKey } from './Pages';
import { $PageNode } from './revised';
import { Iterator } from './types';
import { findTargetIndexInLists } from './utils';

export interface IBtreeIterator
  extends Omit<Iterator<RecordKey>, 'next' | 'current'> {
  next(page: PageCore, queryKey: RecordKey): number | null;
  current(): number | null;
}

/**
 * Implements an iterator for traversing a B-tree structure.
 * Maintains internal state across calls using `$IteratorNode`.
 * This hasn;t to be only for b tree
 */
export class BtreeIterator implements IBtreeIterator {
  #iteratorNode: $IteratorNode;

  constructor(iteratorNode?: $IteratorNode) {
    this.#iteratorNode = iteratorNode ?? createIteratorNode();
  }

  /**
   * Returns the current index of the traversal.
   */
  current(): number | null {
    return this.#iteratorNode.index;
  }

  value(): number | null {
    return this.#iteratorNode.value;
  }

  offset(): number | null {
    return this.#iteratorNode.position;
  }

  /**
   * Attempts to search the given page for a query key.
   * If the key exists, its index is stored. Otherwise, determines the next child index to descend into.
   *
   * @param page - The current B-tree page to search.
   * @param queryKey - The target key to search for.
   * @returns The index of the child to visit next, or `null` if traversal should stop.
   */
  next(page: $PageNode<number>, queryKey: RecordKey): number | null {
    search.call(this.#iteratorNode, page, queryKey);

    return this.#iteratorNode.index;
  }

  end() {
    if (this.#iteratorNode.last) {
      return true;
    }

    return false;
  }
}

/**
 * Performs a single-step traversal in the B-tree to locate the given key
 * or determine the next child index to descend into.
 *
 * This function does not recurse; it updates the iterator node state
 * for one level based on the current page and query key.
 *
 * @param this - The iterator node (`$IteratorNode`) maintaining traversal state.
 * @param page - The current B-tree page to search.
 * @param queryKey - The key to search for.
 * @returns The updated iterator node after this traversal step.
 */
export function search<T>(
  this: $IteratorNode,
  page: $PageNode<T>,
  queryKey: T,
): $IteratorNode {
  const indexOfQueryKey = findTargetIndexInLists(page.recordKeys, queryKey);

  if (indexOfQueryKey != null) {
    this.index = indexOfQueryKey;
    this.value = page.recordKeys[this.index] as number;
    return this;
  }

  const nextIndex = getNextPageIndex(page.recordKeys, queryKey);

  this.index = nextIndex;

  return this;
}

export function getIterator() {
  return new BtreeIterator();
}

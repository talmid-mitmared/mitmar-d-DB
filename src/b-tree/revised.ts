/**
 * Copyright (c) 2025 resetmerlin
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @tsdoc
 */

/**
 * Minimum degree type for B-tree structures.
 */
export type MinimumDegree = number;

export type $PageNode<T> = {
  minimumDegree: MinimumDegree;
  recordKeys: T[];
  children: $PageNode<T>[];
};

export function createPageNodeImplObject<T>(
  minimumDegree: MinimumDegree,
  recordKeys: T[] = [],
  children: $PageNode<T>[] = [],
): $PageNode<T> {
  const page: $PageNode<T> = {
    minimumDegree,
    recordKeys,
    children,
  };

  return page;
}
/**
 * Initializes the internal state of an iterator node.
 *
 * @param this - The iterator node object to initialize.
 */
function createPageNodeImplObjectt<T>(this: $PageNode<T>) {
  this.minimumDegree = 0;
  this.children = [];
  this.recordKeys = [];
}

/**
 * Creates and initializes a new B-tree iterator node object.
 *
 * @returns A new `$IteratorNode` with default traversal state.
 *
 * @example
 * ```ts
 * const node = createIteratorNode();
 * // node.position === 0
 * // node.index === 0
 * // node.last === false
 * // node.value === null
 * ```
 */
export function createIteratorNode<T>(): $PageNode<T> {
  const node = Object.create(Object.prototype) as $PageNode<T>;
  createPageNodeImplObjectt.call(node);
  return node;
}

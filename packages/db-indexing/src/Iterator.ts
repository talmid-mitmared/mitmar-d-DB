import { $IteratorNode, createIteratorNode } from './IteratorNode';

export interface $Iterator {
  /**
   * Returns the current index within the node.
   * May return `null` if traversal hasn't begun or failed.
   */
  current(): $IteratorNode['index'];

  /**
   * Advances the iterator and returns the new index position.
   */
  next(): $IteratorNode['index'];

  /**
   * Returns the key or value at the current index.
   */
  value(): $IteratorNode['value'];
}

export interface Aggregator {
  getIterator(): $Iterator;
}

/**
 * Generic iterator for tree-like structures (e.g. B-trees, tries).
 *
 * Delegates the traversal logic to an injected search function,
 * enabling pluggable traversal semantics (e.g. binary search, DFS).
 *
 * Maintains state using a `$IteratorNode`, which encapsulates:
 * - position (depth level)
 * - index (current key/child index)
 * - value (last visited key)
 * - last (traversal end flag)
 */
export class TreeIterator implements $Iterator {
  #iteratorNode: $IteratorNode;

  /**
   * Search strategy injected at construction.
   * Must be bound to the iterator node via `this`.
   */
  search: (node: $IteratorNode) => $IteratorNode;

  constructor(search: (node: $IteratorNode) => $IteratorNode, iteratorNode?: $IteratorNode) {
    this.#iteratorNode = iteratorNode ?? createIteratorNode();
    this.search = search;
  }

  /**
   * Returns the current index within the node.
   * Does not mutate state.
   */
  current(): number | null {
    return this.#iteratorNode.index;
  }

  /**
   * Returns the key or value at the current traversal index.
   */
  value(): number | null {
    return this.#iteratorNode.value;
  }

  /**
   * Returns the current depth level of the traversal.
   */
  offset(): number | null {
    return this.#iteratorNode.position;
  }

  /**
   * Advances traversal by invoking the search strategy.
   * Delegates mutation of internal state to the search implementation.
   *
   * @returns Updated index after advancing, or `null` if end reached.
   */
  next(): number | null {
    this.#iteratorNode = this.search(
      // We clone the iterator node to prevent runtime object hidden error
      createIteratorNode(this.#iteratorNode),
    );

    return this.#iteratorNode.index;
  }

  /**
   * Checks if traversal has reached a terminal leaf node
   * or a condition where no further movement is possible.
   *
   * @returns `true` if traversal is complete.
   */
  end(): boolean {
    return this.#iteratorNode.last;
  }
}

export function getIterator(search: (node: $IteratorNode) => $IteratorNode) {
  return new TreeIterator(search);
}

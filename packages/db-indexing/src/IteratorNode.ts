/**
 * Represents internal traversal metadata used by a B-tree iterator.
 * @todo Need to abstract more when another tree comes
 */
export type $IteratorNode = {
  /**
   * Tracks the current depth within the B-tree.
   * Root starts at 0; increments as we descend.
   */
  position: number;

  /**
   * Index of the current key or child node at this depth.
   * Can be `null` if traversal hasn't started or failed early.
   */
  index: number | null;

  /**
   * Marks whether the traversal hit a terminal leaf node with no result.
   * Used to short-circuit or finalize search when exhausted.
   */
  last: boolean;

  /**
   * The most recently visited key during search.
   * Null when uninitialized or search yielded no result.
   */
  value: number | null;
};

/**
 * Constructs a new `$IteratorNode` object from an optional base state.
 * Ensures fallback to default values when fields are missing.
 */
function createIteratorNodeImplObject(iteratorNode?: $IteratorNode): $IteratorNode {
  const metadata: $IteratorNode = {
    position: 0,
    index: null,
    value: null,
    last: false,
  };

  if (iteratorNode != null) {
    metadata.position = iteratorNode.position;
    metadata.index = iteratorNode.index;
    metadata.last = iteratorNode.last;
    metadata.value = iteratorNode.value;
  }

  return metadata;
}

// Flag indicating whether class-based iterator metadata is used.
// Currently hardcoded as false to enforce function-only implementation.
const classImpl = false as const;

export const createIteratorNode = !classImpl
  ? createIteratorNodeImplObject
  : createIteratorNodeImplObject;

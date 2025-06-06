/**
 * Copyright (c) 2025 resetmerlin
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @tsdoc
 */

/**
 * Represents internal traversal metadata used by a B-tree iterator.
 * @todo Need to abstract more when another tree comes
 */
export type $IteratorMetadata = {
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
 * Constructs a new `$IteratorMetadata` object from an optional base state.
 * Ensures fallback to default values when fields are missing.
 */
function createIteratorMetadataImplObject(
  iteratorMetadata?: $IteratorMetadata,
): $IteratorMetadata {
  const metadata: $IteratorMetadata = {
    position: 0,
    index: null,
    value: null,
    last: false,
  };

  if (iteratorMetadata != null) {
    metadata.position = iteratorMetadata.position;
    metadata.index = iteratorMetadata.index;
    metadata.last = iteratorMetadata.last;
    metadata.value = iteratorMetadata.value;
  }

  return metadata;
}

// Flag indicating whether class-based iterator metadata is used.
// Currently hardcoded as false to enforce function-only implementation.
const classImpl = false as const;

export const createIteratorMetadata = !classImpl
  ? createIteratorMetadataImplObject
  : null;

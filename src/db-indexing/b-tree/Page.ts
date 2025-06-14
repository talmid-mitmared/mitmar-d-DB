/**
 * Copyright (c) 2025 resetmerlin
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @tsdoc
 */

import {
  MaxNumberOfKeysFormula,
  MinNumberOfKeysFormula,
  PrimaryKeyIndexFormula,
} from '../utils/tree';

export type RecordKey = number;

/**
 * Represents a single page (or node) in a B-tree.
 *
 * - `recordKeys`: ordered list of keys stored in the node.
 * - `children`: subpages (empty if leaf).
 * - `minimumDegree`: branching factor `t` (defines min/max key count).
 */
export type $BtPage = {
  recordKeys: RecordKey[];
  children: $BtPage[];
  minimumDegree: number;
};

/**
 * Returns whether a page is a leaf (i.e., has no children).
 */
export function isPageLeaf(page: $BtPage): boolean {
  return page.children.length === 0;
}

/**
 * Determines if the page has exceeded its allowed key capacity.
 *
 * Overflows trigger split operations during insertions.
 */
export function isPageOverflows(page: $BtPage): boolean {
  return page.recordKeys.length >= MaxNumberOfKeysFormula(page.minimumDegree);
}

/**
 * Determines if the page has dropped below its allowed key minimum.
 *
 * Underflows require a merge or rotation with sibling pages during deletions.
 */
export function isPageUnderflows(page: $BtPage): boolean {
  return page.recordKeys.length < MinNumberOfKeysFormula(page.minimumDegree);
}

/**
 * Calculates the index of the median key for splitting the page.
 *
 * Used during page splits to promote the middle key to the parent.
 */
export function getIndexOfPrimaryKey(page: $BtPage): number {
  return PrimaryKeyIndexFormula(page.minimumDegree);
}

/**
 * Determines whether a new key can be inserted into the current page.
 *
 * Insertion is only valid if:
 * - Page is not overflown
 * - Page is a leaf (internal nodes defer to children)
 */
export function isAbleToInsert(page: $BtPage): boolean {
  return isPageOverflows(page) === false && isPageLeaf(page);
}

function createBtreePageImplObject(returnBPage: $BtPage): $BtPage {
  const page: $BtPage = {
    recordKeys: returnBPage.recordKeys ?? [],
    children: returnBPage.children ?? [],
    minimumDegree: returnBPage.minimumDegree,
  };

  return page;
}

// Toggle between object-based and class-based implementation.
// Currently defaults to functional style for tree node construction.
const classImpl = false as const;

export const createBtreePage = !classImpl
  ? createBtreePageImplObject
  : createBtreePageImplObject; // fallback kept consistent for now

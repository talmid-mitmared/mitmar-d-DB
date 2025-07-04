import {
  MaxNumberOfKeysFormula,
  MinNumberOfKeysFormula,
  PredecessorOfKeysFormula,
  PrimaryKeyIndexFormula,
  SuccessorOfKeysFormula,
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
 * Determines if the page will be dropped below its allowed key minimum.
 *
 * Underflows require a merge or rotation with sibling pages during deletions.
 */
export function isPageWillUnderflows(page?: $BtPage): boolean {
  if (page == null) return true;

  return page.recordKeys.length <= MinNumberOfKeysFormula(page.minimumDegree);
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
 * successor is the smallest key of right child node
 */
export function getSucessorIndex() {
  return SuccessorOfKeysFormula();
}

/**
 * predecssor is the larget key of left child node
 */
export function getPredecessorIndex(page: $BtPage) {
  return PredecessorOfKeysFormula(page.recordKeys.length);
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

function createBtreePageImplObject(returnBPage?: $BtPage): $BtPage {
  const page: $BtPage = {
    recordKeys: returnBPage?.recordKeys.slice() ?? [],
    children: returnBPage?.children.map((child) => ({ ...child })) ?? [],
    minimumDegree: returnBPage?.minimumDegree ?? 0,
  };

  return page;
}

// Toggle between object-based and class-based implementation.
// Currently defaults to functional style for tree node construction.
const classImpl = false as const;

export const createBtreePage = !classImpl ? createBtreePageImplObject : createBtreePageImplObject; // fallback kept consistent for now

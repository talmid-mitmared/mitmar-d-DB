import {
  MaxNumberOfKeysFormula,
  MinNumberOfKeysFormula,
  PredecessorOfKeysFormula,
  PrimaryKeyIndexFormula,
  SuccessorOfKeysFormula,
} from '../utils/tree';

export type RecordKey = number;

export type $BtPage = {
  recordKeys: RecordKey[];
  children: $BtPage[];
  readonly minimumDegree: number;
};

export function isPageLeaf(page: $BtPage): boolean {
  return page.children.length === 0;
}

export function isPageOverflows(page: $BtPage): boolean {
  return page.recordKeys.length > MaxNumberOfKeysFormula(page.minimumDegree);
}

export function isPageUnderflows(page: $BtPage): boolean {
  return page.recordKeys.length < MinNumberOfKeysFormula(page.minimumDegree);
}

export function isPageWillUnderflows(page?: $BtPage): boolean {
  if (page == null) return true;

  return page.recordKeys.length <= MinNumberOfKeysFormula(page.minimumDegree);
}

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
  if (!returnBPage) {
    return {
      recordKeys: [],
      children: [],
      minimumDegree: 0,
    };
  }

  return {
    recordKeys: [...returnBPage.recordKeys],
    children: returnBPage.children.map((child) => createBtreePageImplObject(child)),
    minimumDegree: returnBPage.minimumDegree,
  };
}

export function createBtreePage(returnBPage?: $BtPage) {
  const original = createBtreePageImplObject(returnBPage);

  /**
   * @todo: Has to put dev after implementing the debugger
   */
  // if (__DEV__) {
  //   // We have to make sure we cannot revise the object of original one instead we can revise the copied Version
  //   Object.freeze(original.recordKeys);
  //   /**
  //    * @todo: Have to add this code
  //    */
  //   // Object.freeze(original.children);

  //   return original;
  // }

  return original;
}

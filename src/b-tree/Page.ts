import {
  MaxNumberOfKeysFormula,
  MinNumberOfKeysFormula,
  PrimaryKeyIndexFormula,
} from './tree-utils';

export type RecordKey = number;

export type $BtPage = {
  recordKeys: RecordKey[];
  children: $BtPage[];
  minimumDegree: number;
};

export function isPageLeaf(page: $BtPage) {
  return page.children.length === 0;
}

export function isPageOverflows(page: $BtPage) {
  return page.recordKeys.length >= MaxNumberOfKeysFormula(page.minimumDegree);
}

export function isPageUnderflows(page: $BtPage) {
  return page.recordKeys.length < MinNumberOfKeysFormula(page.minimumDegree);
}

export function getIndexOfPrimaryKey(page: $BtPage) {
  return PrimaryKeyIndexFormula(page.minimumDegree);
}

export function isAbleToInsert(page: $BtPage) {
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

// Flag indicating whether class-based iterator metadata is used.
// Currently hardcoded as false to enforce function-only implementation.
const classImpl = false as const;

export const createBtreePage = !classImpl ? createBtreePageImplObject : null;

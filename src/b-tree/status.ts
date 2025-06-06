import {
  MaxNumberOfKeysFormula,
  MinNumberOfKeysFormula,
  PrimaryKeyIndexFormula,
} from './primitive';

// Have to refactor into Btree status
export abstract class Status {
  public isPageLeaf(childrenLength: number): boolean {
    return childrenLength === 0;
  }

  public isPageOverflows(recordKeyLength: number, t: number): boolean {
    return recordKeyLength >= MaxNumberOfKeysFormula(t);
  }

  public isPageUnderflows(recordKeyLength: number, t: number): boolean {
    return recordKeyLength < MinNumberOfKeysFormula(t);
  }

  public indexOfPrimaryKey(t: number): number {
    return PrimaryKeyIndexFormula(t);
  }
}

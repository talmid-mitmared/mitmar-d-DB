import {
  getNextIndexForTraverse,
  insertKeyInTargetIndex,
} from '../index-utils';
import { PrimitivePage } from './primitive';
import { insertElementInLists } from './utils';

export type RecordKey = number;
export type RecordKeys = RecordKey[];
export type MinimumDegree = number;

// have to rename as BtreePage or whatever
export class PageCore extends PrimitivePage<RecordKey> {
  constructor(
    minimumDegree: number,
    keys: RecordKeys = [],
    children: PageCore[] = [],
  ) {
    super(keys, children, minimumDegree);
  }

  public get children(): PageCore[] {
    return super.children as PageCore[];
  }

  public get isAbleToInsert() {
    return this.isPageOverflows() === false && this.isPageLeaf();
  }

  public clone() {
    return super.clone() as PageCore;
  }

  // public isPageLeaf(): boolean {
  //   const childrenLength = this.children.length;

  //   return super.isPageLeaf(childrenLength);
  // }

  // public isPageOverflows(): boolean {
  //   const recordKeyLength = this.recordKeys.length;

  //   return super.isPageOverflows(recordKeyLength, this.minimumDegree);
  // }

  // public isPageUnderflows(): boolean {
  //   const recordKeyLength = this.recordKeys.length;

  //   return super.isPageUnderflows(recordKeyLength, this.minimumDegree);
  // }

  // public get primaryKey() {
  //   const index = super.indexOfPrimaryKey(this.minimumDegree);
  //   return this.recordKeys[index];
  // }

  // public get primaryKeyIndex(): number {
  //   return super.indexOfPrimaryKey(this.minimumDegree);
  // }

  public insertKey(indexToInsert: null | number, queryKey: RecordKey) {
    const index = indexToInsert ?? getNextIndexForTraverse(this, queryKey);

    if (index == null) return;

    const keys = this.clone().recordKeys;

    const insertedKeys = insertKeyInTargetIndex(keys, index, queryKey, 0);

    super.setKeys(insertedKeys);
  }

  public insertChildren(indexToInsert: null | number, children: PageCore[]) {
    if (indexToInsert == null) return;

    const baseChildren = this.clone().children;

    const insertedChildren = insertElementInLists({
      baseLists: baseChildren,
      indexToInsert,
      elementsToInsert: children,
    });

    super.setChildren(insertedChildren);
  }
}

import {
  MaxNumberOfKeysFormula,
  MinNumberOfKeysFormula,
  PrimaryKeyIndexFormula,
} from './b-tree/b-tree';
import { PrimitivePage } from './b-tree/primitive';
import { insertElementInLists } from './b-tree/utils';

type RecordKey = number;
type RecordKeys = RecordKey[];
type MinimumDegree = number;

export class Page extends PrimitivePage<RecordKey> {
  #t: MinimumDegree;

  constructor(
    minimumDegree: number,
    keys: number[] = [],
    children: PrimitivePage<RecordKey>[] = [],
  ) {
    super(keys, children);
    this.#t = minimumDegree;
  }

  public isPageUnderflow(numKeys: number) {
    return numKeys < MinNumberOfKeysFormula(this.#t);
  }

  public insertPagesToChildren(indexToInsert: number, pages: Page[]) {
    const updatedChildren = insertElementInLists({
      baseLists: this.children,
      indexToInsert,
      elementsToInsert: pages,
    });

    this.#children = updatedChildren;
  }

  public get isPageWillUnderflow() {
    return this.recordKeys.length <= MinNumberOfKeysFormula(this.#t);
  }

  public get primaryKeyIndex() {
    return PrimaryKeyIndexFormula(this.#t);
  }

  public set addKey(key: number) {
    this.#recordKeys.push(key);

    /**
     * @todo: Need to change it into binary sort
     */
    this.#recordKeys.sort((a, b) => a - b);
  }

  public get isPageOverflows() {
    return this.isPageFull === false;
  }

  public getNextChildIndexForTraverse(query: RecordKey) {
    if (this.isLeaf) {
      console.error(
        'There is no children to traverse, you reached leaf of the tree',
      );
      return null;
    }

    const index = this.#recordKeys.findIndex((element) => query < element);

    if (index === -1) {
      return this.#recordKeys.length;
    }

    return index;
  }

  public clone() {
    const clone = Object.create(this);
  }
}

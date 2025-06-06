import { Status } from './status';

export interface Page<T> {
  recordKeys: T[];
  children: Page<T>[];
}

export class PrimitivePage<T> extends Status implements Page<T> {
  #children: PrimitivePage<T>[] = [];
  #recordKeys: T[] = [];
  #t: number;

  constructor(
    keys: T[] = [],
    children: PrimitivePage<T>[] = [],
    minimumDegree: number,
  ) {
    super();
    this.#children = children;
    this.#recordKeys = keys;
    this.#t = minimumDegree;
  }

  public get recordKeys() {
    return this.#recordKeys;
  }

  public get children() {
    return this.#children;
  }
  public get minimumDegree() {
    return this.#t;
  }

  protected setKeys(keys: T[]): void {
    this.#recordKeys = keys;
  }

  protected setChildren(children: PrimitivePage<T>[]): void {
    this.#children = children;
  }

  public clone() {
    return new PrimitivePage(
      this.recordKeys,
      this.children,
      this.minimumDegree,
    );
  }
}

export function MaxNumberOfKeysFormula(degree: number) {
  const formula = (t: number) => {
    return 2 * t - 1;
  };
  return formula(degree);
}

export function MinNumberOfKeysFormula(degree: number) {
  const formula = (t: number) => {
    return t - 1;
  };
  return formula(degree);
}

export function PrimaryKeyIndexFormula(degree: number) {
  const formula = (t: number) => {
    return t - 1;
  };
  return formula(degree);
}

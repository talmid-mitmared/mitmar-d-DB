export interface Iterator<T> {
  current(): T;
  next(): T;
  value(): unknown;
}

export interface Aggregator<T> {
  getIterator(): Iterator<T>;
}

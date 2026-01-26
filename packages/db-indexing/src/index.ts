export { TreeIterator, type $Iterator, getIterator } from './Iterator';
export { createIteratorNode, type $IteratorNode } from './IteratorNode';
export * from './utils';
export * from './b-tree';

if (typeof __DEV__ === 'undefined') {
  __DEV__ = process.env.NODE_ENV !== 'production';
}

// import {
//   deleteElementInArray,
//   findTargetIndex,
//   insertElementInArray,
//   sliceArrayToTargetIndex,
// } from './utils';

// export class Page {
//   /**
//    * Defines the minimum degree (t) of the B-tree.
//    * This value being used for the tree's height, maximum number of keys per node, and branching factor.
//    */
//   private _minimumDegree: number;
//   private _children: Page[] = [];
//   private recordKeys: number[] = [];

//   constructor(
//     minimumDegree: number,
//     keys: number[] = [],
//     children: Page[] = [],
//   ) {
//     this._minimumDegree = minimumDegree;
//     this.recordKeys = keys;
//     this._children = children;
//   }

//   /**
//    * Performs a search operation in the B-tree.
//    * Time complexity: O(log N) in a balanced B-tree.
//    */
//   public Search(queryKey: number): boolean {
//     const queryFounded = this.recordKeys.includes(queryKey);
//     if (queryFounded) {
//       return true;
//     }

//     if (this.isLeaf && queryFounded === false) {
//       return false;
//     }

//     return this._children[this.getNextChildDirection(queryKey)]?.Search(
//       queryKey,
//     );
//   }

//   public Insert(queryKey: number, parentNode?: Page) {
//     const isNotRoot = parentNode != null;
//     if (
//       /**
//        * Inserts the key only if the current node is a leaf (i.e., has no children).
//        * If the node isn't full, the key is inserted directly without needing a split.
//        */
//       this.isLeaf &&
//       !this.isPageFull
//     ) {
//       return (this.addKey = queryKey);
//     }

//     if (
//       /**
//        * The page is full and a parent node exists — we must promote a key to the parent,
//        * so a split operation is required.
//        */
//       this.isPageFull &&
//       isNotRoot
//     ) {
//       this.promoteIncomingPageAsParent(parentNode);

//       const index = parentNode.getNextChildDirection(queryKey);

//       parentNode._children[index]?.Insert(queryKey, this);

//       return;
//     }

//     const index = this.getNextChildDirection(queryKey);

//     this._children[index]?.Insert(queryKey, this);
//   }

//   public Delete(queryKey: number, parentNode?: Page) {
//     const nextChildIndex = this.getNextChildDirection(queryKey);
//     const queryChild = this._children[nextChildIndex];

//     const childQueryIndex = findTargetIndex(queryChild?.recordKeys, queryKey);

//     const leafNode = queryChild.isLeaf && childQueryIndex != null;
//     const internalNode = queryChild.isLeaf === false && childQueryIndex != null;

//     if (leafNode) {
//       if (queryChild.treeWillUnbalanced) {
//         const { borrowedKey, indexToBorrow, isUnderflows } =
//           this.borrowKeyFromChild(nextChildIndex);

//         if (borrowedKey && isUnderflows === false) {
//           const baseKey = this.recordKeys[childQueryIndex];

//           this._children[indexToBorrow].addKey = baseKey;

//           this.recordKeys[childQueryIndex] = borrowedKey;
//         } else {
//           const newPage = new Page(this._minimumDegree);

//           newPage.assignNewKeys = newPage.recordKeys.concat(
//             queryChild.recordKeys,
//             this._children[indexToBorrow].recordKeys,
//           );

//           newPage.addKey = this.recordKeys
//             .splice(nextChildIndex, 1)
//             .pop() as number;
//         }
//       }
//     }
//     if (internalNode) {
//       const { borrowedKey } = queryChild.borrowKeyFromChild(queryKey);

//       if (borrowedKey == null) return;

//       queryChild.addKey = borrowedKey;
//     }

//     if (!queryChild.treeWillUnbalanced) {
//       this._children[nextChildIndex].deleteKeys = queryKey;
//       return;
//     }

//     this._children[nextChildIndex]?.Delete(queryKey, this);
//   }

//   /**
//    * The B-Tree will be Unbalanced if the node key length is less or equal to 0 after deletion
//    */
//   private get treeWillUnbalanced() {
//     const DELETE_COUNT = 1;
//     const futureKeyLength = this.recordKeys.length - DELETE_COUNT;

//     return this.isPageUnderflow(futureKeyLength);
//   }

//   public promoteIncomingPageAsParent(parentNode: Page) {
//     const { primaryKey, leftPage, rightPage } = this.splitOperation();

//     const newChildren = insertElementInArray({
//       baseLists: parentNode._children,
//       indexToInsert: Page.GetSearchQueryIndex(
//         parentNode.recordKeys,
//         primaryKey,
//       ),
//       elementsToInsert: [leftPage, rightPage],
//     });

//     parentNode.assignNewChildren = newChildren;
//     parentNode.addKey = primaryKey;
//   }

//   // Splits this node into two new nodes and returns left/right + promoted middle key
//   private splitOperationV2(index: number) {
//     const primaryKey = this.recordKeys[index];

//     /**
//      * When promoting a key, we must also consider splitting the child nodes.
//      * The children are divided into left and right groups corresponding to the split.
//      */
//     const { left: leftChildren, right: rightChildren } =
//       Page.SliceArrayIntoLeftRight(this._children, index + 1);

//     const leftKeys = sliceArrayToTargetIndex({
//       lists: this.recordKeys,
//       destIndex: index,
//     });

//     const rightKeys = sliceArrayToTargetIndex({
//       lists: this.recordKeys,
//       startIndex: index + 1,
//       destIndex: this.recordKeys.length,
//     });

//     const leftPage = new Page(this._minimumDegree, leftKeys, leftChildren);
//     const rightPage = new Page(this._minimumDegree, rightKeys, rightChildren);

//     return {
//       leftPage,
//       rightPage,
//       primaryKey,
//     };
//   }

//   // Splits this node into two new nodes and returns left/right + promoted middle key
//   private splitOperation() {
//     const middleIndex = this.primaryKeyIndex;
//     const primaryKey = this.recordKeys[middleIndex];

//     /**
//      * When promoting a key, we must also consider splitting the child nodes.
//      * The children are divided into left and right groups corresponding to the split.
//      */
//     const { left: leftChildren, right: rightChildren } =
//       Page.SliceArrayIntoLeftRight(this._children, this._minimumDegree);

//     const leftKeys = sliceArrayToTargetIndex({
//       lists: this.recordKeys,
//       destIndex: middleIndex,
//     });

//     const rightKeys = sliceArrayToTargetIndex({
//       lists: this.recordKeys,
//       startIndex: middleIndex + 1,
//       destIndex: this.recordKeys.length,
//     });

//     const leftPage = new Page(this._minimumDegree, leftKeys, leftChildren);
//     const rightPage = new Page(this._minimumDegree, rightKeys, rightChildren);

//     return {
//       leftPage,
//       rightPage,
//       primaryKey,
//     };
//   }

//   private borrowKeyFromChild(queryKey: number) {
//     const { isUnderflows, indexToBorrow, borrowDirection } =
//       this.isSiblingsAreUnderflow(queryKey);

//     if (isUnderflows == false) {
//       const targetToBorrow = this._children[indexToBorrow];

//       return {
//         borrowedKey:
//           borrowDirection === 'RIGHT'
//             ? targetToBorrow.borrowSmallestKeyInNode()
//             : targetToBorrow.borrowLargestKeyInNode(),
//         indexToBorrow,
//         isUnderflows,
//       };
//     }
//     return {
//       borrowedKey: null,
//       indexToBorrow,
//       isUnderflows,
//     };
//   }

//   /**
//    * predecssor is the larget key of left child node
//    */
//   private borrowLargestKeyInNode() {
//     if (this.isPageWillUnderflow) {
//       return null;
//     }

//     return this.recordKeys.pop();
//   }

//   /**
//    * successor is the smallest key of right child node
//    */
//   private borrowSmallestKeyInNode() {
//     if (this.isPageWillUnderflow) {
//       return null;
//     }
//     return this.recordKeys.shift();
//   }

//   private getAbsolutePageToBorrow(queryKey: number) {
//     const index = this.getNextChildDirection(queryKey);

//     if (index === 0) {
//       return {
//         leftSiblingIndex: null,
//         rightSiblingIndex: index + 1,
//       };
//     }

//     if (index === this.recordKeys.length) {
//       return {
//         leftSiblingIndex: index - 1,
//         rightSiblingIndex: null,
//       };
//     }

//     return {
//       leftSiblingIndex: index - 1,
//       rightSiblingIndex: index + 1,
//     };
//   }

//   private isSiblingsAreUnderflow(queryKey: number) {
//     const { leftSiblingIndex, rightSiblingIndex } =
//       this.getAbsolutePageToBorrow(queryKey);

//     if (leftSiblingIndex == null) {
//       const isUnderflows = this._children[rightSiblingIndex].treeWillUnbalanced;

//       return {
//         isUnderflows,
//         indexToBorrow: rightSiblingIndex,
//         borrowDirection: 'RIGHT',
//       } as const;
//     }

//     if (rightSiblingIndex == null) {
//       const isUnderflows = this._children[leftSiblingIndex].treeWillUnbalanced;
//       if (queryKey === 19) {
//         console.log(this._children[rightSiblingIndex]);
//         console.log(this._children[leftSiblingIndex]);
//       }
//       return {
//         isUnderflows,
//         indexToBorrow: leftSiblingIndex,
//         borrowDirection: 'LEFT',
//       } as const;
//     }
//     const isUnderflows =
//       this._children[leftSiblingIndex].treeWillUnbalanced &&
//       this._children[rightSiblingIndex].treeWillUnbalanced;

//     return {
//       isUnderflows,
//       indexToBorrow:
//         this._children[leftSiblingIndex].treeWillUnbalanced === false
//           ? leftSiblingIndex
//           : rightSiblingIndex,
//       borrowDirection:
//         this._children[leftSiblingIndex].treeWillUnbalanced === false
//           ? 'LEFT'
//           : 'RIGHT',
//     } as const;
//   }

//   private getNextChildDirection(queryKey: number) {
//     const index = Page.GetSearchQueryIndex(this.recordKeys, queryKey);

//     return index;
//   }

//   public get isLeaf() {
//     return this._children.length === 0;
//   }

//   public get children() {
//     return this._children;
//   }

//   public get isPageFull() {
//     return (
//       this.recordKeys.length >=
//       BTree.MaxNumberOfKeysFormula(this._minimumDegree)
//     );
//   }

//   public isPageUnderflow(numKeys: number) {
//     return numKeys < BTree.MinNumberOfKeysFormula(this._minimumDegree);
//   }

//   private get isPageWillUnderflow() {
//     return (
//       this.recordKeys.length <=
//       BTree.MinNumberOfKeysFormula(this._minimumDegree)
//     );
//   }

//   public get getRecordKeys() {
//     return this.recordKeys;
//   }

//   public get primaryKeyIndex() {
//     return BTree.PrimaryKeyIndexFormula(this._minimumDegree);
//   }

//   public set assignNewKeys(keys: number[]) {
//     this.recordKeys = keys;
//   }

//   public set deleteKeys(targetKey: number) {
//     const deletedKeys = deleteElementInArray({
//       baseLists: this.recordKeys,
//       targetValue: targetKey,
//     });

//     this.assignNewKeys = deletedKeys;
//   }

//   public set assignNewChildren(children: Page[]) {
//     this._children = children;
//   }

//   private set addKey(key: number) {
//     this.recordKeys.push(key);
//     /**
//      * @todo: Need to change it into binary sort
//      */
//     this.recordKeys.sort((a, b) => a - b);
//   }

//   static GetSearchQueryIndex<T>(lists: Array<T>, target: T) {
//     const index = lists.findIndex((element) => target < element);

//     if (index === -1) {
//       return lists.length;
//     }
//     return index;
//   }

//   static SliceArrayIntoLeftRight<T>(lists: Array<T>, standard: number) {
//     return {
//       left: lists.slice(0, standard),
//       right: lists.slice(standard),
//     };
//   }
// }

// export class BTree {
//   private _minimumDegree: number;
//   private root: Page;

//   constructor(t: number) {
//     this.root = new Page(t);
//     this._minimumDegree = t;
//   }

//   public Insert(queryKey: number) {
//     const queryFounded = this.root.Search(queryKey);

//     if (queryFounded) return;

//     if (this.root.isPageFull) {
//       const newParentPage = new Page(this._minimumDegree);
//       this.root.promoteIncomingPageAsParent(newParentPage);

//       this.root = newParentPage;
//     }

//     this.root.Insert(queryKey);
//   }

//   public Delete(queryKey: number) {
//     const queryFounded = this.root.Search(queryKey);

//     if (queryFounded) {
//       this.root.Delete(queryKey);
//     }
//   }

//   public get rootPage() {
//     return this.root;
//   }

//   static MaxNumberOfKeysFormula(degree: number) {
//     const formula = (t: number) => {
//       return 2 * t - 1;
//     };
//     return formula(degree);
//   }

//   static MinNumberOfKeysFormula(degree: number) {
//     const formula = (t: number) => {
//       return t - 1;
//     };
//     return formula(degree);
//   }

//   static PrimaryKeyIndexFormula(degree: number) {
//     const formula = (t: number) => {
//       return t - 1;
//     };
//     return formula(degree);
//   }
// }

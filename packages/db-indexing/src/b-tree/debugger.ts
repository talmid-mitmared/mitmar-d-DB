import { $BtPage } from './Page';

const PAGE_ID = Symbol('pageId');
let nextId = 1;

export function tagPage(page: $BtPage): $BtPage {
  if (!(PAGE_ID in page)) {
    Object.defineProperty(page, PAGE_ID, {
      value: nextId++,
      enumerable: false,
    });
  }
  return page;
}

export function idOf(page: $BtPage | null | undefined) {
  return page ? (page as any)[PAGE_ID] : null;
}

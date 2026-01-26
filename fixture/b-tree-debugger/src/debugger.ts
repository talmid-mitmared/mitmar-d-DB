import type { $BtPage } from '@mitmared-db/db-indexing';

type PageId = number;

let nextPageId: PageId = 1;

const pageIdMap = new WeakMap<$BtPage, PageId>();

function getPageUniqueID(page: $BtPage): PageId | null {
  if (!pageIdMap.has(page)) {
    pageIdMap.set(page, nextPageId++);
  }

  return pageIdMap.get(page) ?? null;
}

function getTrackablePageId(page?: $BtPage): PageId | null {
  if (page == null) return null;
  if (!page.recordKeys?.length) return null;

  return getPageUniqueID(page);
}

type PageSnapshot = {
  id: PageId;
  page: $BtPage;
};

type PageDebugReport = {
  rootId: PageId | null;
  nodes: Record<PageId, PageSnapshot>;
};

/**
 * This is Dev-only page graph snapshot.
 * In prod, returns null to avoid any overhead/leaks.
 */
export function createPageDebugReport(root?: $BtPage): PageDebugReport | null {
  const nodes: Record<PageId, PageSnapshot> = {};

  function capturePage(id: PageId, page: $BtPage) {
    if (nodes[id]) return;
    nodes[id] = { id, page };
  }

  const rootId = getTrackablePageId(root);

  if (rootId != null && root) {
    capturePage(rootId, root);
  }

  return { rootId, nodes };
}

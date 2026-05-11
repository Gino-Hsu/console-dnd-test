import type { EditOperation, PageGraph } from '@/types/layout';

const PAGE_ID = 'page-1';

// ─────────────────────────────────────
// Page
// ─────────────────────────────────────

export type CurrentPageResponse = {
  base: {
    id: string;
    pageId: string;
    version: number;
    status: string;
    graph: PageGraph;
  };
  editLogs: EditOperation[];
};

const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://127.0.0.1:3001';
  }
  return '/api';
};

/**
 * Published snapshot + editLogs
 */
export async function getCurrentPage(): Promise<CurrentPageResponse> {
  const baseUrl = getBaseUrl();
  const path = baseUrl.includes('3001')
    ? `/pages/current/${PAGE_ID}`
    : `/pages/current/${PAGE_ID}`; // Same path relative to /api or /

  const res = await fetch(`${baseUrl}${path}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch current page: ${res.status}`);
  }

  return res.json();
}

/**
 * Latest published snapshot only
 */
export async function getPublishedPage() {
  const baseUrl = getBaseUrl();
  const path = baseUrl.includes('3001')
    ? `/pages/published/${PAGE_ID}`
    : `/pages/published/${PAGE_ID}`;

  const res = await fetch(`${baseUrl}${path}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch published page: ${res.status}`);
  }

  return res.json();
}

/**
 * Publish new version
 */
export async function publishPage(
  graph: PageGraph,
): Promise<{ version: number }> {
  const baseUrl = getBaseUrl();
  const path = baseUrl.includes('3001')
    ? `/pages/publish/${PAGE_ID}`
    : `/pages/publish/${PAGE_ID}`;

  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(graph),
  });

  if (!res.ok) {
    throw new Error(`Failed to publish page: ${res.status}`);
  }

  return res.json();
}

// ─────────────────────────────────────
// Edit logs (operations)
// ─────────────────────────────────────

/**
 * Get operation logs
 */
export async function getEditLogs(): Promise<EditOperation[]> {
  const baseUrl = getBaseUrl();
  const path = baseUrl.includes('3001')
    ? `/editLogs/${PAGE_ID}`
    : `/editLogs/${PAGE_ID}`;

  const res = await fetch(`${baseUrl}${path}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch editLogs: ${res.status}`);
  }

  return res.json();
}

/**
 * Append operation log
 */
export async function appendEditLog(operation: EditOperation): Promise<void> {
  const baseUrl = getBaseUrl();
  const path = baseUrl.includes('3001') ? `/editLogs` : `/editLogs`;

  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pageId: PAGE_ID,
      ...operation,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to append editLog: ${res.status}`);
  }
}

/**
 * Clear edit logs
 */
export async function clearEditLogs(): Promise<void> {
  const baseUrl = getBaseUrl();
  const path = baseUrl.includes('3001')
    ? `/editLogs/${PAGE_ID}`
    : `/editLogs/${PAGE_ID}`;

  const res = await fetch(`${baseUrl}${path}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`Failed to clear editLogs: ${res.status}`);
  }
}

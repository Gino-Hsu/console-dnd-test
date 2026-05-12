import { PageGraph } from '@/types/layout';

const BASE = 'http://localhost:3001';
const PAGE_ID = 'page-1';

// ── Published page ────────────────────────────────────────────────────────────

/** Fetch the latest published version of the page. */
export const getLatestPage = async (): Promise<PageGraph> => {
    const res = await fetch(`${BASE}/pages/latest/${PAGE_ID}`, {
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to fetch page: ${res.status}`);
    return res.json();
};

/** Publish current graph as a new page version. Clears editLogs & appends publishLog. */
export const publishPage = async (
    graph: PageGraph,
): Promise<{ version: number }> => {
    const res = await fetch(`${BASE}/pages/publish/${PAGE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...graph, status: 'published' }),
    });
    if (!res.ok) throw new Error(`Failed to publish page: ${res.status}`);
    return res.json();
};

// ── Edit logs ─────────────────────────────────────────────────────────────────

/** Get the latest editLog entry for the page (returns null if none). */
export const getLatestEditLog = async (): Promise<PageGraph | null> => {
    const res = await fetch(`${BASE}/editLogs/current/${PAGE_ID}`, {
        cache: 'no-store',
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch editLog: ${res.status}`);
    const entry = await res.json();
    return entry.graph as PageGraph;
};

/** Append an edit step with the current graph snapshot. */
export const appendEditLog = async (
    graph: PageGraph,
    action = 'edit',
    description = '',
): Promise<void> => {
    const res = await fetch(`${BASE}/editLogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: PAGE_ID, action, description, graph }),
    });
    if (!res.ok) throw new Error(`Failed to append editLog: ${res.status}`);
};

// ── Aliases / deprecated ──────────────────────────────────────────────────────

/** @deprecated use getLatestPage */
export const getPageGraph = getLatestPage;
/** @deprecated use publishPage */
export const savePageGraph = publishPage;

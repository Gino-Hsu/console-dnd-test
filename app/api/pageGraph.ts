import { PageGraph } from '@/types/layout';

const BASE = 'http://localhost:3001';
const PAGE_ID = 'page-1';

// ── Published page ────────────────────────────────────────────────────────────

export const getPageGraph = async (): Promise<PageGraph> => {
    const res = await fetch(`${BASE}/pages/${PAGE_ID}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch page: ${res.status}`);
    return res.json();
};

export const publishPage = async (graph: PageGraph): Promise<void> => {
    const res = await fetch(`${BASE}/pages/${PAGE_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...graph, status: 'published' }),
    });
    if (!res.ok) throw new Error(`Failed to publish page: ${res.status}`);
};

// ── Draft ─────────────────────────────────────────────────────────────────────

export const getDraft = async (): Promise<PageGraph | null> => {
    const res = await fetch(`${BASE}/drafts/${PAGE_ID}`, { cache: 'no-store' });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch draft: ${res.status}`);
    return res.json();
};

export const saveDraft = async (graph: PageGraph): Promise<void> => {
    const res = await fetch(`${BASE}/drafts/${PAGE_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...graph, status: 'draft' }),
    });
    if (!res.ok) throw new Error(`Failed to save draft: ${res.status}`);
};

export const discardDraft = async (): Promise<void> => {
    await fetch(`${BASE}/drafts/${PAGE_ID}`, { method: 'DELETE' });
};

// ── Edit log ──────────────────────────────────────────────────────────────────

export const appendEditLog = async (entry: {
    pageId: string;
    draftId?: string;
    action: string;
    description?: string;
    payload?: Record<string, unknown>;
}): Promise<void> => {
    await fetch(`${BASE}/editLogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
    });
};

/** @deprecated use publishPage */
export const savePageGraph = publishPage;

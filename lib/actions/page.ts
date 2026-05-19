'use server';

import type { EditOperation, PageGraph } from '@/types/layout';

const DB_BASE = 'http://127.0.0.1:3001';
const PAGE_ID = 'page-1';

// ─── Types ────────────────────────────────────────────────────

export type CurrentPageResponse = {
    base: PageGraph & {
        id: string;
        pageId: string;
        version: number;
        status: string;
    };
    editLogs: EditOperation[];
};

// ─── Page ─────────────────────────────────────────────────────

/**
 * Fetch the latest published snapshot + pending editLogs.
 * Used by the editor on initial load.
 */
export async function getCurrentPage(): Promise<CurrentPageResponse> {
    const res = await fetch(`${DB_BASE}/pages/current/${PAGE_ID}`, {
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(`getCurrentPage failed: ${res.status}`);
    return res.json();
}

/**
 * Fetch only the latest published snapshot.
 * Used by the frontpage viewer.
 */
export async function getPublishedPage(): Promise<PageGraph> {
    const res = await fetch(`${DB_BASE}/pages/published/${PAGE_ID}`, {
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(`getPublishedPage failed: ${res.status}`);
    return res.json();
}

/**
 * Publish a new page version.
 * Clears editLogs and appends a publishLog on the server side.
 */
export async function publishPage(
    graph: PageGraph,
): Promise<{ version: number }> {
    const res = await fetch(`${DB_BASE}/pages/publish/${PAGE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graph),
    });
    if (!res.ok) throw new Error(`publishPage failed: ${res.status}`);
    return res.json();
}

// ─── Edit Logs ────────────────────────────────────────────────

/**
 * Append one edit operation to the log.
 * Called automatically after each structural change (immediate)
 * or debounced after property edits.
 */
export async function appendEditLog(operation: EditOperation): Promise<void> {
    const res = await fetch(`${DB_BASE}/editLogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: PAGE_ID, ...operation }),
    });
    if (!res.ok) throw new Error(`appendEditLog failed: ${res.status}`);
}

/**
 * Fetch all pending edit logs for the page.
 */
export async function getEditLogs(): Promise<EditOperation[]> {
    const res = await fetch(`${DB_BASE}/editLogs/${PAGE_ID}`, {
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(`getEditLogs failed: ${res.status}`);
    return res.json();
}

/**
 * Clear all pending edit logs (called after publish).
 */
export async function clearEditLogs(): Promise<void> {
    const res = await fetch(`${DB_BASE}/editLogs/${PAGE_ID}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error(`clearEditLogs failed: ${res.status}`);
}

// Re-export everything from Server Actions.
// This file is kept for backwards compatibility — prefer importing from '@/lib/actions/page' directly.
export {
    getCurrentPage,
    getPublishedPage,
    publishPage,
    appendEditLog,
    getEditLogs,
    clearEditLogs,
} from '@/lib/actions/page';

export type { CurrentPageResponse } from '@/lib/actions/page';

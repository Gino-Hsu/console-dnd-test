import type { NestedLayout } from '@/types/layout';

// ── Flex ─────────────────────────────────────────────────────────────────────

/**
 * 計算拖曳後的 flex slot 寬度（百分比，已 normalize 至總和 100）
 */
export function resizeFlexSlots(
    currentWidths: number[],
    slotIndex: number,
    deltaPercent: number,
): number[] {
    const next = [...currentWidths];
    next[slotIndex] = Math.max(5, next[slotIndex] + deltaPercent);
    next[slotIndex + 1] = Math.max(5, next[slotIndex + 1] - deltaPercent);
    const total = next.reduce((a, b) => a + b, 0);
    return next.map(w => (w / total) * 100);
}

// ── Grid columns ─────────────────────────────────────────────────────────────

/**
 * 計算拖曳後的 grid 欄寬（fr 比例，已 normalize 至總和 100）
 */
export function resizeGridCols(
    colWidths: number[],
    colIndex: number,
    deltaPercent: number,
): number[] {
    const next = [...colWidths];
    next[colIndex] = Math.max(5, next[colIndex] + deltaPercent);
    next[colIndex + 1] = Math.max(5, next[colIndex + 1] - deltaPercent);
    const total = next.reduce((a, b) => a + b, 0);
    return next.map(w => (w / total) * 100);
}

/**
 * 計算欄分隔拖曳條的 CSS left 值（字串，可直接放入 style.left）
 * 考慮 fr 單位與 colGap，將拖曳條置於間距正中央。
 */
export function gridColHandleLeft(
    colWidths: number[],
    colIndex: number,
    colGap: number,
): string {
    const cols = colWidths.length;
    const totalFr = colWidths.reduce((a, b) => a + b, 0);
    const leftFr = colWidths.slice(0, colIndex + 1).reduce((a, b) => a + b, 0);
    const fraction = leftFr / totalFr;
    const subtractPx = (fraction * (cols - 1) * colGap).toFixed(2);
    const addPx = colIndex * colGap + colGap / 2;
    // center = fraction*(containerW - (cols-1)*gap) + colIndex*gap + gap/2
    return `calc(${fraction * 100}% - ${subtractPx}px + ${addPx}px - 4px)`;
}

// ── Grid rows ─────────────────────────────────────────────────────────────────

/**
 * 計算拖曳後的 grid 列高（px），最小 40px
 */
// export function resizeGridRows(
//     rowHeights: number[],
//     rowIndex: number,
//     dy: number,
// ): number[] {
//     const next = [...rowHeights];
//     next[rowIndex] = Math.max(40, next[rowIndex] + dy);
//     next[rowIndex + 1] = Math.max(40, next[rowIndex + 1] - dy);
//     return next;
// }

/**
 * 計算列分隔拖曳條距離容器頂部的 px 值（置於間距正中央）
 */
export function gridRowHandleTop(
    rowHeights: number[],
    rowIndex: number,
    rowGap: number,
): number {
    return (
        rowHeights.slice(0, rowIndex + 1).reduce((a, b) => a + b, 0) +
        rowIndex * rowGap +
        rowGap / 2
    );
}

// ── Grid container style ──────────────────────────────────────────────────────

/**
 * 產生 grid 容器的 CSS style（gridTemplateColumns/Rows + gap）
 */
const DEFAULT_GAP = 8;

export function gridContainerStyle(
    layout: Pick<
        NestedLayout,
        'gridColWidths' | 'gridRowHeights' | 'gridColGap' | 'gridRowGap'
    >,
    cols: number,
    defaultColW: number,
): React.CSSProperties {
    const colWidths =
        layout.gridColWidths ?? Array.from({ length: cols }, () => defaultColW);

    return {
        display: 'grid',
        gridTemplateColumns: colWidths.map(w => `${w}fr`).join(' '),
        gridTemplateRows: 'auto',
        columnGap: `${layout.gridColGap ?? DEFAULT_GAP}px`,
        rowGap: `${layout.gridRowGap ?? DEFAULT_GAP}px`,
    };
}

// ── Layout type theme ─────────────────────────────────────────────────────────

type LayoutType = NestedLayout['type'];

const BORDER: Record<LayoutType, [string, string]> = {
    block: ['border-violet-300', 'border-violet-200'],
    flex: ['border-sky-300', 'border-sky-200'],
    grid: ['border-emerald-300', 'border-emerald-200'],
};

const BG: Record<LayoutType, [string, string]> = {
    block: ['bg-violet-50', 'bg-violet-50/70'],
    flex: ['bg-sky-50', 'bg-sky-50/70'],
    grid: ['bg-emerald-50', 'bg-emerald-50/70'],
};

/** 依 layout 類型與巢狀深度回傳 border / bg Tailwind class */
export function layoutTheme(
    type: LayoutType,
    depth = 0,
): { borderColor: string; bgColor: string } {
    const d = depth === 0 ? 0 : 1;
    return { borderColor: BORDER[type][d], bgColor: BG[type][d] };
}

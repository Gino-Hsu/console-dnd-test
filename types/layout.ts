// ─── 基礎型別 ────────────────────────────────────────────────

export type LayoutType = 'block' | 'flex' | 'grid';

export interface LayoutItem {
    id: string;
    type: LayoutType;
    label: string;
}

export interface Slot {
    id: string;
    children: NestedLayout[];
    /** flex 佔比百分比（僅 flex layout 使用），e.g. 50 = 50% */
    flexBasis?: number;
}

export const LAYOUT_CONFIG: Record<LayoutType, { slotCount: number }> = {
    block: { slotCount: 1 },
    flex: { slotCount: 2 },
    grid: { slotCount: 4 },
};

// ─── 間距 ────────────────────────────────────────────────────

export interface SpacingValue {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface LayoutSpacing {
    padding: SpacingValue;
    margin: SpacingValue;
}

export const DEFAULT_SPACING: LayoutSpacing = {
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
};

// ─── 巢狀樹狀結構（編輯時使用） ─────────────────────────────

export interface NestedLayout {
    id: string;
    type: LayoutType;
    label: string;
    props: Record<string, unknown>;
    slots: Slot[];
    spacing: LayoutSpacing;
    /** grid layout 欄寬百分比陣列，長度 = 欄數，e.g. [50, 50] */
    gridColWidths: number[] | null;
    /** grid layout 列高像素陣列，長度 = 列數，e.g. [120, 120] */
    gridRowHeights: number[] | null;
    /** grid layout 欄間距（column-gap），像素 */
    gridColGap: number | null;
    /** grid layout 列間距（row-gap），像素 */
    gridRowGap: number | null;
    /** flex layout slot 欄間距（column-gap），像素 */
    flexGap: number | null;
    /** flex layout 列間距（row-gap），換行時使用，像素 */
    flexRowGap: number | null;
    /** flex layout 是否換行，預設 false */
    flexWrap: boolean | null;
}

// ─── 版本快照 ─────────────────────────────────────────────────

export type PageVersion = {
    pageId: string;
    version: number;
    status: 'draft' | 'published';
    data: NestedLayout[];
    createdAt: string;
};

// ─── 扁平化 Graph 結構（儲存 / 共編使用） ───────────────────

/**
 * 扁平化的 Layout 節點
 * parentSlotId 為 null 表示位於 root 層
 */
export interface FlatLayout {
    id: string;
    type: LayoutType;
    label: string;
    props: Record<string, unknown>;
    spacing: LayoutSpacing;
    slotIds: string[];
    parentSlotId: string | null;
    /** grid layout 欄寬百分比陣列（僅 grid 使用） */
    gridColWidths?: number[] | null;
    /** grid layout 列高像素陣列（僅 grid 使用） */
    gridRowHeights?: number[] | null;
    /** grid layout 欄間距（column-gap），像素 */
    gridColGap?: number | null;
    /** grid layout 列間距（row-gap），像素 */
    gridRowGap?: number | null;
    /** flex layout slot 欄間距（column-gap），像素 */
    flexGap?: number | null;
    /** flex layout 列間距（row-gap），換行時使用，像素 */
    flexRowGap?: number | null;
    /** flex layout 是否換行，預設 false */
    flexWrap?: boolean | null;
}

/**
 * 扁平化的 Slot 節點
 */
export interface FlatSlot {
    id: string;
    childIds: string[];
    parentLayoutId: string;
    /** flex 佔比百分比（僅 flex layout 使用），e.g. 50 = 50% */
    flexBasis?: number;
}

/**
 * 扁平化的頁面 Graph（O(1) 存取，JSON 可序列化）
 */
export interface PageGraph {
    pageId: string;
    version: number;
    status: 'draft' | 'published';
    createdAt: string;
    rootOrder: string[];
    layouts: Record<string, FlatLayout>;
    slots: Record<string, FlatSlot>;
}

// ─── 共編原子操作 ────────────────────────────────────────────

export type PageOperation =
    | {
          type: 'INSERT_LAYOUT';
          layout: FlatLayout;
          targetSlotId: string | 'root';
          atIndex: number;
          seq: number;
          clientId: string;
      }
    | {
          type: 'REMOVE_LAYOUT';
          layoutId: string;
          seq: number;
          clientId: string;
      }
    | {
          type: 'MOVE_LAYOUT';
          layoutId: string;
          fromContainerId: string | 'root';
          toContainerId: string | 'root';
          atIndex: number;
          seq: number;
          clientId: string;
      }
    | {
          type: 'REORDER_LAYOUT';
          containerId: string | 'root';
          layoutId: string;
          fromIndex: number;
          toIndex: number;
          seq: number;
          clientId: string;
      }
    | {
          type: 'UPDATE_SPACING';
          layoutId: string;
          spacing: LayoutSpacing;
          seq: number;
          clientId: string;
      }
    | {
          type: 'ADD_SLOT';
          slot: FlatSlot;
          seq: number;
          clientId: string;
      }
    | {
          type: 'REMOVE_SLOT';
          layoutId: string;
          slotId: string;
          seq: number;
          clientId: string;
      }
    | {
          type: 'UPDATE_SLOT_WIDTHS';
          layoutId: string;
          /** 與 FlatLayout.slotIds 順序相同的 flexBasis 百分比陣列 */
          widths: number[];
          seq: number;
          clientId: string;
      }
    | {
          type: 'UPDATE_GRID_DIMENSIONS';
          layoutId: string;
          /** 欄寬百分比陣列，長度 = 欄數 */
          colWidths: number[];
          /** 列高像素陣列，長度 = 列數 */
          rowHeights: number[];
          /** 欄間距 px（可選） */
          colGap?: number;
          /** 列間距 px（可選） */
          rowGap?: number;
          seq: number;
          clientId: string;
      };

// ─── 側邊欄 ──────────────────────────────────────────────────

export interface SidebarItem {
    type: LayoutType;
    label: string;
    description: string;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
    {
        type: 'block',
        label: '塊級 Layout',
        description: 'Block — 元素獨佔整行，垂直排列',
    },
    {
        type: 'flex',
        label: 'Flex Layout',
        description: 'Flex — 子元素水平排列，支援換行',
    },
    {
        type: 'grid',
        label: 'Grid Layout',
        description: 'Grid — 二維格狀排列，同時控制列與欄',
    },
];

// ─── 基礎型別 ────────────────────────────────────────────────

export type LayoutType = 'block' | 'flex' | 'grid';

export interface LayoutItem {
    id: string;
    type: LayoutType;
    label: string;
}

// ─── Component 型別 ──────────────────────────────────────────

export interface ComponentNode {
    id: string;
    type: 'component';
    componentId: string;
    label: string;
    data: Record<string, unknown>;
    style: Record<string, unknown>;
}

// ─── 統一節點型別 ────────────────────────────────────────────

export type CanvasNode = NestedLayout | ComponentNode;

export interface Slot {
    id: string;
    children: CanvasNode[];
    flexWidthConfig: {
        /** flex 佔比百分比（僅 flex layout 非換行模式使用），e.g. 50 = 50% */
        flexBasis: number;
        /** flex layout 換行模式下各 slot 的像素寬度，預設 200px */
        widthPx: number;
    };
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

export interface FlexConfig {
    /** column-gap，像素 */
    gap: number;
    /** row-gap（換行時使用），像素 */
    rowGap: number;
    /** 是否換行 */
    wrap: boolean;
}

export interface GridConfig {
    /** 欄寬百分比陣列，長度 = 欄數，e.g. [50, 50] */
    colWidths: number[];
    /** 列高像素陣列，長度 = 列數，e.g. [120, 120] */
    rowHeights: number[];
    /** column-gap，像素 */
    colGap: number;
    /** row-gap，像素 */
    rowGap: number;
}

export interface NestedLayout {
    id: string;
    type: LayoutType;
    label: string;
    props: Record<string, unknown>;
    slots: Slot[];
    spacing: LayoutSpacing;
    /** flex layout 專用設定（type !== 'flex' 時為 null） */
    flexConfig: FlexConfig | null;
    /** grid layout 專用設定（type !== 'grid' 時為 null） */
    gridConfig: GridConfig | null;
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
    /** flex layout 專用設定（type !== 'flex' 時為 null） */
    flexConfig: FlexConfig | null;
    /** grid layout 專用設定（type !== 'grid' 時為 null） */
    gridConfig: GridConfig | null;
}

/**
 * 扁平化的 Slot 節點
 */
export interface FlatSlot {
    id: string;
    childIds: string[];
    parentLayoutId: string;
    flexWidthConfig: {
        flexBasis: number | null;
        widthPx: number | null;
    };
    /** flex 佔比百分比（僅 flex layout 使用），e.g. 50 = 50% */
}

/**
 * 扁平化的 Component 節點
 */
export interface FlatComponent {
    id: string;
    componentId: string;
    label: string;
    data: Record<string, unknown>;
    style: Record<string, unknown>;
    parentSlotId: string | null;
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
    components: Record<string, FlatComponent>;
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
          type: 'INSERT_COMPONENT';
          component: FlatComponent;
          targetSlotId: string;
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
          type: 'REMOVE_COMPONENT';
          componentId: string;
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
          type: 'MOVE_COMPONENT';
          componentId: string;
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
          type: 'REORDER_COMPONENT';
          containerId: string | 'root';
          componentId: string;
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

// ─── Type Guards ─────────────────────────────────────────────────

export function isLayoutNode(node: CanvasNode): node is NestedLayout {
    return 'slots' in node;
}

export function isComponentNode(node: CanvasNode): node is ComponentNode {
    return node.type === 'component';
}

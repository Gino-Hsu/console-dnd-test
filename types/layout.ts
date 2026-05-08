// ─── 基礎型別 ────────────────────────────────────────────────

import type { ComponentId } from '@/lib/component-registry/component-ids';

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
    componentId: ComponentId;
    label: string;
    data: Record<string, unknown>;
    style: Record<string, unknown>;
}

// ─── 統一節點型別 ────────────────────────────────────────────

export type CanvasNode = NestedLayout | ComponentNode;

// ─── Drag Overlay 型別 ────────────────────────────────────────

export type SidebarDragItem = 
    | { type: 'layout'; layoutType: LayoutType; label: string }
    | { type: 'component'; componentId: ComponentId; label: string };

// ─── Slot 型別 ────────────────────────────────────────────────

export type SlotAlign = 'left' | 'center' | 'right';

export const ALIGN_CLASS: Record<SlotAlign, string> = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
};

export interface Slot {
    id: string;
    children: CanvasNode[];
    flexWidthConfig: {
        /** flex 佔比百分比（僅 flex layout 非換行模式使用），e.g. 50 = 50% */
        flexBasis: number;
        /** flex layout 換行模式下各 slot 的像素寬度，預設 200px */
        widthPx: number;
    };
    /** slot 內容的水平對齊方式，預設 left */
    align: SlotAlign;
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
    type: 'layout';
    layoutType: LayoutType;
    label: string;
    props: Record<string, unknown>;
    slots: Slot[];
    spacing: LayoutSpacing;
    /** flex layout 專用設定（layoutType !== 'flex' 時為 null） */
    flexConfig: FlexConfig | null;
    /** grid layout 專用設定（layoutType !== 'grid' 時為 null） */
    gridConfig: GridConfig | null;
    /**
     * 僅 root layout（depth === 0）有意義。
     * 'full'      = 100% 寬（預設）
     * 'contained' = 置中容器（max-w-5xl mx-auto）
     */
    containerWidth?: 'full' | 'contained';
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
    type: 'layout';
    layoutType: LayoutType;
    label: string;
    props: Record<string, unknown>;
    spacing: LayoutSpacing;
    slotIds: string[];
    parentSlotId: string | null;
    /** flex layout 專用設定（layoutType !== 'flex' 時為 null） */
    flexConfig: FlexConfig | null;
    /** grid layout 專用設定（layoutType !== 'grid' 時為 null） */
    gridConfig: GridConfig | null;
    /** 僅 root layout 有意義 */
    containerWidth?: 'full' | 'contained';
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
    /** slot 內容的水平對齊方式 */
    align: SlotAlign;
    /** flex 佔比百分比（僅 flex layout 使用），e.g. 50 = 50% */
}

/**
 * 扁平化的 Component 節點
 */
export interface FlatComponent {
    id: string;
    type: 'component';
    componentId: ComponentId;
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
    return node.type === 'layout';
}

export function isComponentNode(node: CanvasNode): node is ComponentNode {
    return node.type === 'component';
}

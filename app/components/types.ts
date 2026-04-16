export type LayoutType = 'block' | 'flex' | 'grid';

export interface LayoutItem {
    id: string;
    type: LayoutType;
    label: string;
}

/** 每種 Layout 預設要有幾個 Slot */
export const LAYOUT_CONFIG: Record<LayoutType, { slotLabels: string[] }> = {
    block: { slotLabels: ['內容區'] },
    flex: { slotLabels: ['左欄', '右欄'] },
    grid: { slotLabels: ['格子1', '格子2', '格子3', '格子4'] },
};

/**
 * Slot 代表一個可放置 Layout 的區域
 */
export interface Slot {
    id: string;
    label: string;
    // 一個 slot 可以放多個 layout
    children: NestedLayout[];
}

/**
 * NestedLayout 支援巢狀 slot 結構
 */
export interface NestedLayout {
    id: string;
    type: LayoutType;
    label: string;
    // 一個 layout 可以有多個 slot
    slots?: Slot[];
}

/** 畫布上單一渲染項目 */
export interface PageDocument {
    id: string;
    type: LayoutType;
    label: string;
    isPlaceholder?: true; // 側邊欄拖曳進入時的暫時佔位
}

/** 畫布版本，渲染項目放在 data 陣列中 */
export type PageVersion = {
    id: string;
    pageId: string;
    version: number;
    status: 'draft' | 'published';
    data: NestedLayout[];
    createdAt: string;
};

/** 側邊欄中可拖曳的來源定義 */
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

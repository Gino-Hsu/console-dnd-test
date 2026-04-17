export type LayoutType = 'block' | 'flex' | 'grid';

export interface LayoutItem {
    id: string;
    type: LayoutType;
    label: string;
}

/** 執行時的 Slot，自帶 id，不需要 label */
export interface Slot {
    id: string;
    children: NestedLayout[];
}

/** 每種 Layout 預設的 Slot 數量 */
export const LAYOUT_CONFIG: Record<LayoutType, { slotCount: number }> = {
    block: { slotCount: 1 },
    flex: { slotCount: 2 },
    grid: { slotCount: 4 },
};

/**
 * NestedLayout 支援巢狀 slot 結構
 */
export interface NestedLayout {
    id: string;
    type: LayoutType;
    label: string;
    /** 任意 props，未來可存按鈕文字、顏色等設定 */
    props: Record<string, unknown>;
    /** slots 陣列，每個 slot 自帶 id */
    slots: Slot[];
}

/** 畫布版本 */
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

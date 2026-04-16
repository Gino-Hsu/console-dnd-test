export type LayoutType = 'block' | 'flex';

export interface LayoutItem {
    id: string;
    type: LayoutType;
    label: string;
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
    data: PageDocument[];
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
];

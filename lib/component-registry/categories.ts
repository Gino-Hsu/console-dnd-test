/**
 * 元件分類定義
 */

import type { CategoryDefinition } from "../../types/component-registry";

/**
 * 分類常數
 */
export const CATEGORIES = {
    HEADING: "heading",
    IMAGE: "image",
} as const;

/**
 * 分類 ID 型別
 */
export type CategoryId = (typeof CATEGORIES)[keyof typeof CATEGORIES];

/**
 * 分類定義
 */
export const categories: Record<CategoryId, CategoryDefinition> = {
    [CATEGORIES.HEADING]: {
        id: CATEGORIES.HEADING,
        name: "標題系列",
        icon: "📝",
        description: "各種標題模組",
        order: 1,
    },
    [CATEGORIES.IMAGE]: {
        id: CATEGORIES.IMAGE,
        name: "圖片系列",
        icon: "🖼️",
        description: "各種圖片模組",
        order: 2,
    },
} as const;

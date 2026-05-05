/**
 * Component Category 主題配色
 *
 * 此文件定義了不同 category 的 UI 樣式主題
 * 所有與 component 顯示相關的顏色配置都集中在這裡管理
 */

import {
    CATEGORIES,
    type CategoryId,
} from "@/lib/component-registry/categories";

export interface CategoryTheme {
    bgColor: string;
    bgColorDark: string;
    borderColor: string;
}

/**
 * Component Category 主題配色映射
 * 使用 CategoryId 作為 key，確保所有定義的 category 都有對應的主題
 */
export const CATEGORY_THEMES: Record<CategoryId, CategoryTheme> = {
    [CATEGORIES.HEADING]: {
        bgColor: 'bg-purple-50',
        bgColorDark: 'bg-purple-300',
        borderColor: 'border-purple-300',
    },
    [CATEGORIES.IMAGE]: {
        bgColor: 'bg-blue-50',
        bgColorDark: 'bg-blue-300',
        borderColor: 'border-blue-300',
    },
} as const;

/**
 * 默認主題（當 category 未定義時使用）
 */
export const DEFAULT_THEME: CategoryTheme = {
    bgColor: 'bg-zinc-50',
    bgColorDark: 'bg-zinc-300',
    borderColor: 'border-zinc-300',
} as const;

/**
 * 根據 category 獲取對應的主題配色
 * @param category - Category ID
 * @returns 對應的主題配色，未找到時返回默認主題
 */
export function getCategoryTheme(category: CategoryId): CategoryTheme {
    return CATEGORY_THEMES[category] || DEFAULT_THEME;
}

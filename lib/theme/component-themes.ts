/**
 * Component Category 主题配色
 * 
 * 此文件定义了不同 category 的 UI 样式主题
 * 所有与 component 显示相关的颜色配置都集中在这里管理
 */

import { CATEGORIES } from '@/lib/component-registry/categories';

export interface CategoryTheme {
    bgColor: string;
    bgColorDark: string;
    borderColor: string;
}

/**
 * Component Category 主题配色映射
 */
export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
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
 * 默认主题（当 category 未定义时使用）
 */
export const DEFAULT_THEME: CategoryTheme = {
    bgColor: 'bg-zinc-50',
    borderColor: 'border-zinc-300',
};

/**
 * 根据 category 获取对应的主题配色
 * @param category - Category ID
 * @returns 对应的主题配色，未找到时返回默认主题
 */
export function getCategoryTheme(category: string): CategoryTheme {
    return CATEGORY_THEMES[category] || DEFAULT_THEME;
}

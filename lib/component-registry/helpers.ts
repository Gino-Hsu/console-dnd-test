/**
 * 元件註冊表工具函數
 */

import { componentRegistry } from "./registry";
import { categories } from "./categories";
import type {
    CategoryDefinition,
    ComponentConfig,
} from "../../types/component-registry";

/**
 * 取得所有類別（依順序排列）
 */
export function getCategories(): CategoryDefinition[] {
    return Object.values(categories).sort(
        (a, b) => (a.order || 0) - (b.order || 0),
    );
}

/**
 * 根據類別取得元件列表
 */
export function getComponentsByCategory(categoryId: string): ComponentConfig[] {
    return Object.values(componentRegistry).filter(
        (config) => config.category === categoryId,
    );
}

/**
 * 搜尋元件
 */
export function searchComponents(query: string): ComponentConfig[] {
    if (!query.trim()) {
        return getAllComponents();
    }

    const lowerQuery = query.toLowerCase();
    return Object.values(componentRegistry).filter(
        (config) =>
            config.componentId.toLowerCase().includes(lowerQuery) ||
            config.label.toLowerCase().includes(lowerQuery) ||
            config.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
}

/**
 * 根據 componentId 取得元件配置
 */
export function getComponentConfig(componentId: string): ComponentConfig | undefined {
    return componentRegistry[componentId];
}

/**
 * 根據 componentId 取得可渲染的 React 元件
 */
export function getComponent(componentId: string) {
    return componentRegistry[componentId]?.component;
}

/**
 * 取得所有元件配置
 */
export function getAllComponents(): ComponentConfig[] {
    return Object.values(componentRegistry);
}

/**
 * 取得類別資訊
 */
export function getCategory(
    categoryId: string,
): CategoryDefinition | undefined {
    return categories[categoryId as keyof typeof categories];
}

/**
 * 檢查元件是否存在
 */
export function hasComponent(componentId: string): boolean {
    return componentId in componentRegistry;
}

/**
 * 取得類別下的元件數量
 */
export function getCategoryComponentCount(categoryId: string): number {
    return Object.values(componentRegistry).filter(
        (config) => config.category === categoryId,
    ).length;
}

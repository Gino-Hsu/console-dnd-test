/**
 * 模組註冊表工具函數
 */

import { componentRegistry } from "./registry";
import { categories } from "./categories";
import type {
    CategoryDefinition,
    ModuleWithId,
    ModuleConfig,
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
 * 根據類別取得模組
 */
export function getModulesByCategory(categoryId: string): ModuleWithId[] {
    return Object.values(componentRegistry).filter(
        (module) => module.category === categoryId,
    );
}

/**
 * 搜尋模組
 */
export function searchModules(query: string): ModuleWithId[] {
    if (!query.trim()) {
        return getAllModules();
    }

    const lowerQuery = query.toLowerCase();
    return Object.values(componentRegistry).filter(
        (module) =>
            module.id.toLowerCase().includes(lowerQuery) ||
            module.label.toLowerCase().includes(lowerQuery) ||
            module.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
}

/**
 * 根據 ID 取得模組
 */
export function getModule(id: string): ModuleConfig | undefined {
    return componentRegistry[id];
}

/**
 * 取得所有模組
 */
export function getAllModules(): ModuleWithId[] {
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
 * 檢查模組是否存在
 */
export function hasModule(id: string): boolean {
    return id in componentRegistry;
}

/**
 * 取得類別下的模組數量
 */
export function getCategoryModuleCount(categoryId: string): number {
    return Object.values(componentRegistry).filter(
        (config) => config.category === categoryId,
    ).length;
}

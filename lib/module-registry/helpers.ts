/**
 * 模組註冊表工具函數
 */

import { moduleRegistry } from "./registry";
import { categories } from "./categories";
import type { ModuleId } from "./module-ids";
import type {
    CategoryDefinition,
    ModuleConfig,
} from "../../types/module-registry";

/**
 * 取得所有類別（依順序排列）
 */
export function getCategories(): CategoryDefinition[] {
    return Object.values(categories).sort(
        (a, b) => (a.order || 0) - (b.order || 0),
    );
}

/**
 * 根據類別取得模組列表
 */
export function getModulesByCategory(categoryId: string): ModuleConfig[] {
    return Object.values(moduleRegistry).filter(
        (config) => config.category === categoryId,
    );
}

/**
 * 搜尋模組
 */
export function searchModules(query: string): ModuleConfig[] {
    if (!query.trim()) {
        return getAllModules();
    }

    const lowerQuery = query.toLowerCase();
    return Object.values(moduleRegistry).filter(
        (config) =>
            config.moduleId.toLowerCase().includes(lowerQuery) ||
            config.label.toLowerCase().includes(lowerQuery) ||
            config.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
}

/**
 * 根據 moduleId 取得模組配置
 */
export function getModuleConfig(
    moduleId: ModuleId,
): ModuleConfig | undefined {
    return moduleRegistry[moduleId];
}

/**
 * 根據 moduleId 取得可渲染的模組
 */
export function getModule(moduleId: ModuleId) {
    return moduleRegistry[moduleId]?.module;
}

/**
 * 取得所有模組配置
 */
export function getAllModules(): ModuleConfig[] {
    return Object.values(moduleRegistry);
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
export function hasModule(moduleId: ModuleId): boolean {
    return moduleId in moduleRegistry;
}

/**
 * 取得類別下的模組數量
 */
export function getCategoryModuleCount(categoryId: string): number {
    return Object.values(moduleRegistry).filter(
        (config) => config.category === categoryId,
    ).length;
}

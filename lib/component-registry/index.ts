/**
 * 模組註冊表統一導出
 */

// 型別
export type {
    ModuleConfig,
    CategoryDefinition,
    ModuleWithId,
    ModuleRegistry,
} from "../../types/component-registry";

// 分類
export { CATEGORIES, categories, type CategoryId } from "./categories";

// 註冊表
export { componentRegistry } from "./registry";

// 工具函數
export {
    getCategories,
    getModulesByCategory,
    searchModules,
    getModule,
    getAllModules,
    getCategory,
    hasModule,
    getCategoryModuleCount,
} from "./helpers";

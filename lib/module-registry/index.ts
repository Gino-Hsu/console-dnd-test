/**
 * 模組註冊表統一導出
 */

// 型別
export type {
    ModuleConfig,
    CategoryDefinition,
    ModuleRegistry,
} from "../../types/module-registry";

// 分類
export { CATEGORIES, categories, type CategoryId } from "./categories";

// Module IDs
export { MODULE_IDS, type ModuleId } from "./module-ids";

// 註冊表
export { moduleRegistry } from "./registry";

// 工具函數
export {
    getCategories,
    getModulesByCategory,
    searchModules,
    getModuleConfig,
    getAllModules,
    getCategory,
    hasModule,
    getCategoryModuleCount,
    getModule,
} from "./helpers";

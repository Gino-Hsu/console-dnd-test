/**
 * 元件註冊表統一導出
 */

// 型別
export type {
    ComponentConfig,
    CategoryDefinition,
    ComponentRegistry,
} from "../../types/component-registry";

// 分類
export { CATEGORIES, categories, type CategoryId } from "./categories";

// 註冊表
export { componentRegistry } from "./registry";

// 工具函數
export {
    getCategories,
    getComponentsByCategory,
    searchComponents,
    getComponentConfig,
    getAllComponents,
    getCategory,
    hasComponent,
    getCategoryComponentCount,
    getComponent,
} from "./helpers";

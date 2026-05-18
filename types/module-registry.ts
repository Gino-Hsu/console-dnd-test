/**
 * 模組註冊表型別定義
 */

import React from "react";
import type { CategoryId } from "@/lib/module-registry/categories";
import type { ModuleId } from "@/lib/module-registry/module-ids";

/**
 * 模組配置介面
 */
export interface ModuleConfig {
    /** 模組 ID */
    moduleId: ModuleId;
    /** 模組名稱 */
    moduleName: string;
    /** 模組 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    module: React.ComponentType<any>;
    /** 分類 ID */
    category: CategoryId;
    /** 顯示標籤 */
    label: string;
    /** 圖示 (可以是 emoji 或圖示名稱) */
    icon: string;
    /** 搜尋標籤 */
    tags?: string[];
    /** 預設資料 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultData?: any;
    /** 預設樣式 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultStyle?: any;
    /** 預覽縮圖 URL */
    thumbnail?: string;
}

/**
 * 模組註冊表型別
 */
export type ModuleRegistry = Record<ModuleId, ModuleConfig>;

/**
 * 分類定義
 */
export interface CategoryDefinition {
    id: CategoryId;
    name: string;
    icon: string;
    description?: string;
    order?: number;
}

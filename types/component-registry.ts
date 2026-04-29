/**
 * 模組註冊表型別定義
 */

import React from "react";

/**
 * 模組配置介面
 */
export interface ModuleConfig {
    /** 模組 ID */
    id: string;
    /** React 組件 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.ComponentType<any>;
    /** 分類 ID */
    category: string;
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
export type ModuleRegistry = Record<string, ModuleConfig>;

/**
 * 分類定義
 */
export interface CategoryDefinition {
    id: string;
    name: string;
    icon: string;
    description?: string;
    order?: number;
}

/**
 * 帶 ID 的模組配置
 */
export interface ModuleWithId extends ModuleConfig {
    id: string;
}

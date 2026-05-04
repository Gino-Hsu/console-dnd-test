/**
 * 元件註冊表型別定義
 */

import React from "react";

/**
 * 元件配置介面
 */
export interface ComponentConfig {
    /** 元件 ID */
    componentId: string;
    /** 元件名稱 */
    componentName: string;
    /** React 元件 */
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
 * 元件註冊表型別
 */
export type ComponentRegistry = Record<string, ComponentConfig>;

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

/**
 * Component ID 常數定義 (Single Source of Truth)
 *
 * 所有的 Component ID 都在這裡統一定義
 * 其他地方使用 ComponentId 型別來確保型別安全
 */

/**
 * Component ID 常數
 */
export const COMPONENT_IDS = {
    H01: "H01",
    H02: "H02",
    I01: "I01",
} as const;

/**
 * Component ID 型別
 * 自動從 COMPONENT_IDS 衍生，確保型別與實際定義同步
 */
export type ComponentId = (typeof COMPONENT_IDS)[keyof typeof COMPONENT_IDS];

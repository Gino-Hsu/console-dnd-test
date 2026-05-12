/**
 * Module ID 常數定義 (Single Source of Truth)
 *
 * 所有的 Module ID 都在這裡統一定義
 * 其他地方使用 ModuleId 型別來確保型別安全
 */

/**
 * Module ID 常數
 */
export const MODULE_IDS = {
    H01: "H01",
    H02: "H02",
    I01: "I01",
} as const;

/**
 * Module ID 型別
 */
export type ModuleId = (typeof MODULE_IDS)[keyof typeof MODULE_IDS];

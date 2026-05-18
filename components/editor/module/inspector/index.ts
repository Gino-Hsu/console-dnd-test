import { MODULE_IDS, type ModuleId } from '@/lib/module-registry/module-ids';
import type { InspectorRegistry } from './types';

// Heading inspectors
import HeadingSimpleInspector from './headings/HeadingSimpleInspector';
import HeadingDividedInspector from './headings/HeadingDividedInspector';

// Image inspectors
import ImageSimpleInspector from './images/ImageSimpleInspector';

/**
 * Inspector 註冊表
 */
export const inspectorRegistry: InspectorRegistry = {
    // Heading
    [MODULE_IDS.H01]: HeadingSimpleInspector,
    [MODULE_IDS.H02]: HeadingDividedInspector,

    // Image
    [MODULE_IDS.I01]: ImageSimpleInspector,
} as const;

/**
 * 取得 Inspector
 */
export function getInspector(moduleId: ModuleId) {
    return inspectorRegistry[moduleId];
}

/**
 * 檢查是否有註冊 Inspector
 */
export function hasInspector(moduleId: ModuleId): boolean {
    return moduleId in inspectorRegistry;
}

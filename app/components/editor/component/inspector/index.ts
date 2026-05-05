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
    H01: HeadingSimpleInspector,
    H02: HeadingDividedInspector,

    // Image
    I01: ImageSimpleInspector,
};

/**
 * 取得 Inspector 元件
 */
export function getInspector(componentId: string) {
    return inspectorRegistry[componentId];
}

/**
 * 檢查是否有註冊 Inspector
 */
export function hasInspector(componentId: string): boolean {
    return componentId in inspectorRegistry;
}

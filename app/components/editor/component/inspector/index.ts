import { COMPONENT_IDS, type ComponentId } from '@/lib/component-registry/component-ids';
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
    [COMPONENT_IDS.H01]: HeadingSimpleInspector,
    [COMPONENT_IDS.H02]: HeadingDividedInspector,

    // Image
    [COMPONENT_IDS.I01]: ImageSimpleInspector,
} as const;

/**
 * 取得 Inspector 元件
 */
export function getInspector(componentId: ComponentId) {
    return inspectorRegistry[componentId];
}

/**
 * 檢查是否有註冊 Inspector
 */
export function hasInspector(componentId: ComponentId): boolean {
    return componentId in inspectorRegistry;
}

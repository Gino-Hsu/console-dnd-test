import { v4 as uuidv4 } from 'uuid';
import type { LayoutType, NestedLayout, Slot } from '@/types/layout';
import { DEFAULT_SPACING, LAYOUT_CONFIG } from '@/types/layout';

export function genId(): string {
    return uuidv4();
}

/**
 * 建立一個帶預設 slots 的 NestedLayout
 * 每個 slot 使用 UUID id，spacing 使用預設值
 */
export function createLayout(type: LayoutType, label: string): NestedLayout {
    const { slotCount } = LAYOUT_CONFIG[type];
    const equalBasis = 100 / slotCount;
    const slots: Slot[] = Array.from({ length: slotCount }, () => ({
        id: genId(),
        children: [],
        flexWidthConfig: {
            flexBasis: equalBasis,
            widthPx: 400,
        },
    }));
    return {
        id: genId(),
        type,
        label,
        props: {},
        slots,
        spacing: structuredClone(DEFAULT_SPACING),
        flexConfig: type === 'flex' ? { gap: 8, rowGap: 8, wrap: false } : null,
        gridConfig:
            type === 'grid'
                ? {
                      colWidths: [50, 50],
                      rowHeights: [120, 120],
                      colGap: 8,
                      rowGap: 8,
                  }
                : null,
    };
}

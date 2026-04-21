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
    const equalBasis = type === 'flex' ? 100 / slotCount : undefined;
    const slots: Slot[] = Array.from({ length: slotCount }, () => ({
        id: genId(),
        children: [],
        ...(equalBasis !== undefined ? { flexBasis: equalBasis } : {}),
    }));
    return {
        id: genId(),
        type,
        label,
        props: {},
        slots,
        spacing: structuredClone(DEFAULT_SPACING),
        // grid layout：預設 2 欄等寬、2 列等高、gap 8px
        ...(type === 'grid'
            ? {
                  gridColWidths: [50, 50],
                  gridRowHeights: [120, 120],
                  gridColGap: 8,
                  gridRowGap: 8,
              }
            : {}),
        ...(type === 'flex' ? { flexGap: 8 } : {}),
    };
}

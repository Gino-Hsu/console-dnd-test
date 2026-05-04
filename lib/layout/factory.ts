import { v4 as uuidv4 } from 'uuid';
import type {
    LayoutType,
    NestedLayout,
    Slot,
    ComponentNode,
} from '@/types/layout';
import { DEFAULT_SPACING, LAYOUT_CONFIG, isLayoutNode } from '@/types/layout';
import { getComponentConfig } from '@/lib/component-registry';

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

/**
 * 建立一個新的 Component
 * @param componentId Component ID (e.g. 'H01', 'I01')
 * @param label 顯示標籤
 * @returns ComponentNode
 */
export function createComponent(
    componentId: string,
    label: string,
): ComponentNode {
    const config = getComponentConfig(componentId);

    if (!config) {
        throw new Error(`Invalid component ID: ${componentId}`);
    }

    return {
        id: genId(),
        type: 'component',
        componentId,
        label,
        data: config.defaultData,
        style: config.defaultStyle,
    };
}

/**
 * 在巢狀的 layout tree 中尋找指定 id 的 layout
 * @param id layout id
 * @param items layouts 巢狀資料
 * @returns 找到的 layout 或 null
 */
export function findLayout(
    id: string,
    items: NestedLayout[],
): NestedLayout | null {
    for (const l of items) {
        if (l.id === id) return l;
        for (const s of l.slots) {
            const layoutChildren = s.children.filter(isLayoutNode);
            const found = findLayout(id, layoutChildren);
            if (found) return found;
        }
    }
    return null;
}

/**
 * 深度遍歷，對每個 layout 套用 transform，保持其餘不變
 * @param items layouts 巢狀資料
 * @param transform 轉換函式，接受一個 layout 並回傳轉換後的 layout
 * @returns 轉換後的巢狀 layout 陣列
 */
export function mapLayouts(
    items: NestedLayout[],
    transform: (l: NestedLayout) => NestedLayout,
): NestedLayout[] {
    return items.map(l => {
        const mapped = transform(l);
        return {
            ...mapped,
            slots: mapped.slots.map(s => ({
                ...s,
                children: [
                    ...s.children.filter(c => !isLayoutNode(c)),
                    ...mapLayouts(
                        s.children.filter(isLayoutNode),
                        transform,
                    ),
                ],
            })),
        };
    });
}

/**
 * 更新指定 layout 的欄位，其他保持不變
 * @param items layouts 巢狀資料
 * @param id 要更新的 layout id
 * @param patch 要更新的欄位
 * @returns 更新後的巢狀 layout 陣列
 */
export function updateField(
    items: NestedLayout[],
    id: string,
    patch: Partial<NestedLayout>,
): NestedLayout[] {
    return mapLayouts(items, l => (l.id === id ? { ...l, ...patch } : l));
}

/**
 * 在指定 layout 中新增 slot，並根據 layout type 調整其他 slot 的寬度或 grid 的列高
 * @param items layouts 巢狀資料
 * @param layoutId 要新增 slot 的 layout id
 * @returns 更新後的巢狀 layout 陣列
 */
export function addSlotToLayout(
    items: NestedLayout[],
    layoutId: string,
): NestedLayout[] {
    return mapLayouts(items, l => {
        if (l.id !== layoutId) return l;
        const newSlot: Slot = {
            id: uuidv4(),
            children: [],
            flexWidthConfig: { flexBasis: 50, widthPx: 200 },
        };
        const newSlots = [...l.slots, newSlot];
        if (l.type === 'flex') {
            const eq = 100 / newSlots.length;
            return {
                ...l,
                slots: newSlots.map(s => ({
                    ...s,
                    flexWidthConfig: { ...s.flexWidthConfig, flexBasis: eq },
                })),
            };
        }
        if (l.type === 'grid') {
            const cols = l.gridConfig?.colWidths?.length ?? 2;
            const newRowCount = Math.ceil(newSlots.length / cols);
            const newRowHeights = Array.from(
                { length: newRowCount },
                (_, i) => l.gridConfig?.rowHeights?.[i] ?? 120,
            );
            return {
                ...l,
                slots: newSlots,
                gridConfig: { ...l.gridConfig!, rowHeights: newRowHeights },
            };
        }
        return { ...l, slots: newSlots };
    });
}

/**
 * 從指定 layout 中移除 slot，並調整剩餘 slot 的寬度或 grid 的列高
 * @param items layouts 巢狀資料
 * @param layoutId 要移除 slot 的 layout id
 * @param slotId 要移除的 slot id
 * @returns 更新後的巢狀 layout 陣列
 */
export function removeSlotFromLayout(
    items: NestedLayout[],
    layoutId: string,
    slotId: string,
): NestedLayout[] {
    return mapLayouts(items, l => {
        if (l.id !== layoutId) return l;
        const remaining = l.slots.filter(s => s.id !== slotId);
        if (l.type === 'flex' && remaining.length > 0) {
            const eq = 100 / remaining.length;
            return {
                ...l,
                slots: remaining.map(s => ({
                    ...s,
                    flexWidthConfig: { ...s.flexWidthConfig, flexBasis: eq },
                })),
            };
        }
        if (l.type === 'grid') {
            const cols = l.gridConfig?.colWidths?.length ?? 2;
            const newRowCount = Math.max(1, Math.ceil(remaining.length / cols));
            const newRowHeights = Array.from(
                { length: newRowCount },
                (_, i) => l.gridConfig?.rowHeights?.[i] ?? 120,
            );
            return {
                ...l,
                slots: remaining,
                gridConfig: { ...l.gridConfig!, rowHeights: newRowHeights },
            };
        }
        return { ...l, slots: remaining };
    });
}

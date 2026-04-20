import { arrayMove } from '@dnd-kit/sortable';
import type { NestedLayout } from '@/types/layout';

// ─── 查詢 ────────────────────────────────────────────────────

/**
 * 遞迴找出某個 layout 所在的容器
 * 回傳 'root' 或 slotId；找不到回傳 null
 */
export function findContainer(
    itemId: string,
    items: NestedLayout[],
): string | null {
    if (items.some(l => l.id === itemId)) return 'root';
    for (const layout of items) {
        for (const slot of layout.slots) {
            if (slot.children.some(c => c.id === itemId)) return slot.id;
            const found = findContainer(itemId, slot.children);
            if (found) return found;
        }
    }
    return null;
}

/** 遞迴找出指定 id 的 NestedLayout；找不到回傳 null */
export function findLayoutById(
    id: string,
    items: NestedLayout[],
): NestedLayout | null {
    for (const l of items) {
        if (l.id === id) return l;
        for (const s of l.slots) {
            const found = findLayoutById(id, s.children);
            if (found) return found;
        }
    }
    return null;
}

// ─── 變換（純函式，不 mutate） ───────────────────────────────

/** 遞迴在指定 slot 內插入一個 layout（可指定位置） */
export function insertIntoSlot(
    items: NestedLayout[],
    ownerId: string,
    slotId: string,
    newLayout: NestedLayout,
    atIndex?: number,
): NestedLayout[] {
    return items.map(layout => {
        const slotIdx = layout.slots.findIndex(s => s.id === slotId);
        if (slotIdx !== -1) {
            return {
                ...layout,
                slots: layout.slots.map((s, i) => {
                    if (i !== slotIdx) return s;
                    const children = [...s.children];
                    children.splice(atIndex ?? children.length, 0, newLayout);
                    return { ...s, children };
                }),
            };
        }
        return {
            ...layout,
            slots: layout.slots.map(s => ({
                ...s,
                children: insertIntoSlot(
                    s.children,
                    ownerId,
                    slotId,
                    newLayout,
                    atIndex,
                ),
            })),
        };
    });
}

/** 遞迴在指定容器內對兩個 item 做排序 */
export function sortInContainer(
    items: NestedLayout[],
    containerId: string,
    activeId: string,
    overId: string,
): NestedLayout[] {
    if (containerId === 'root') {
        const oldIndex = items.findIndex(i => i.id === activeId);
        const newIndex = items.findIndex(i => i.id === overId);
        if (oldIndex === -1 || newIndex === -1) return items;
        return arrayMove(items, oldIndex, newIndex);
    }
    return items.map(layout => {
        const slotIdx = layout.slots.findIndex(s => s.id === containerId);
        if (slotIdx !== -1) {
            return {
                ...layout,
                slots: layout.slots.map((s, i) => {
                    if (i !== slotIdx) return s;
                    const oldIndex = s.children.findIndex(
                        c => c.id === activeId,
                    );
                    const newIndex = s.children.findIndex(c => c.id === overId);
                    if (oldIndex === -1 || newIndex === -1) return s;
                    return {
                        ...s,
                        children: arrayMove(s.children, oldIndex, newIndex),
                    };
                }),
            };
        }
        return {
            ...layout,
            slots: layout.slots.map(s => ({
                ...s,
                children: sortInContainer(
                    s.children,
                    containerId,
                    activeId,
                    overId,
                ),
            })),
        };
    });
}

/** 遞迴移除某個 layout */
export function removeItem(items: NestedLayout[], id: string): NestedLayout[] {
    return items
        .filter(l => l.id !== id)
        .map(layout => ({
            ...layout,
            slots: layout.slots.map(s => ({
                ...s,
                children: removeItem(s.children, id),
            })),
        }));
}

/**
 * 將 activeId 從原位置移除，插入到 targetContainerId 的 atIndex 位置
 * targetContainerId 可為 'root' 或任意 slotId
 */
export function moveItem(
    items: NestedLayout[],
    activeId: string,
    targetContainerId: string,
    atIndex?: number,
): NestedLayout[] {
    const moving = findLayoutById(activeId, items);
    if (!moving) return items;

    const withoutActive = removeItem(items, activeId);

    if (targetContainerId === 'root') {
        const next = [...withoutActive];
        next.splice(atIndex ?? next.length, 0, moving);
        return next;
    }

    return insertIntoSlot(
        withoutActive,
        '',
        targetContainerId,
        moving,
        atIndex,
    );
}

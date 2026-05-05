import { arrayMove } from '@dnd-kit/sortable';
import type { NestedLayout, CanvasNode } from '@/types/layout';
import { isLayoutNode } from '@/types/layout';

// ─── 常數 ────────────────────────────────────────────────────

/** 最大允許巢狀層數（root = 0，最深 = MAX_DEPTH） */
export const MAX_DEPTH = 3;

// ─── 查詢 ────────────────────────────────────────────────────
/**
 * 遞迴找出某個 layout 或 component 所在的容器
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
            // 只遞迴進入 LayoutNode
            const layoutChildren = slot.children.filter(isLayoutNode);
            const found = findContainer(itemId, layoutChildren);
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
            const layoutChildren = s.children.filter(isLayoutNode);
            const found = findLayoutById(id, layoutChildren);
            if (found) return found;
        }
    }
    return null;
}

/**
 * 判斷 slotId 是否屬於 layoutId 本身或其任意後代 layout 的 slot。
 * 用來防止 layout 被拖進自己（或子孫）的 slot。
 */
export function isSlotInsideLayout(
    slotId: string,
    layoutId: string,
    items: NestedLayout[],
): boolean {
    const layout = findLayoutById(layoutId, items);
    if (!layout) return false;
    // 遞迴檢查：只要找到此 slot 就回傳 true
    function check(node: NestedLayout): boolean {
        for (const slot of node.slots) {
            if (slot.id === slotId) return true;
            const layoutChildren = slot.children.filter(isLayoutNode);
            for (const child of layoutChildren) {
                if (check(child)) return true;
            }
        }
        return false;
    }
    return check(layout);
}

// ─── 變換（純函式，不 mutate） ───────────────────────────────

/** 遞迴在指定 slot 內插入一個 node（layout 或 component，可指定位置） */
export function insertIntoSlot(
    items: NestedLayout[],
    ownerId: string,
    slotId: string,
    newNode: CanvasNode,
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
                    children.splice(atIndex ?? children.length, 0, newNode);
                    return { ...s, children };
                }),
            };
        }
        return {
            ...layout,
            slots: layout.slots.map(s => ({
                ...s,
                children: insertIntoSlot(
                    s.children.filter(isLayoutNode),
                    ownerId,
                    slotId,
                    newNode,
                    atIndex,
                ),
            })),
        };
    });
}

/**
 * 遞迴找出指定 id 的 CanvasNode（Layout 或 Component）
 */
export function findNodeById(
    id: string,
    items: NestedLayout[],
): CanvasNode | null {
    for (const l of items) {
        if (l.id === id) return l;
        for (const s of l.slots) {
            for (const child of s.children) {
                if (child.id === id) return child;
                if (isLayoutNode(child)) {
                    const found = findNodeById(id, [child]);
                    if (found) return found;
                }
            }
        }
    }
    return null;
}

/**
 * 遞迴移除任何 node（layout 或 component）
 */
export function removeNode(
    items: NestedLayout[],
    id: string,
): NestedLayout[] {
    return items
        .filter(l => l.id !== id)
        .map(layout => ({
            ...layout,
            slots: layout.slots.map(s => ({
                ...s,
                children: s.children
                    .filter(c => c.id !== id)
                    .map(c => (isLayoutNode(c) ? removeNode([c], id)[0] : c))
                    .filter(Boolean),
            })),
        }));
}

/** 遞迴移除某個 layout（向後兼容，內部呼叫 removeNode） */
export function removeItem(items: NestedLayout[], id: string): NestedLayout[] {
    return removeNode(items, id);
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
    const moving = findNodeById(activeId, items);
    if (!moving) return items;

    const withoutActive = removeNode(items, activeId);

    if (targetContainerId === 'root') {
        // 只有 Layout 可以放在 root
        if (!isLayoutNode(moving)) return items;
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

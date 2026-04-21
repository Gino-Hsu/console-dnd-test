import type {
    FlatLayout,
    FlatSlot,
    NestedLayout,
    PageGraph,
    PageOperation,
} from '@/types/layout';

// ─── 轉換 ────────────────────────────────────────────────────

/**
 * 將巢狀 NestedLayout[] 扁平化成 PageGraph
 * 時間複雜度 O(N)，查詢 O(1)，含 parent 引用
 */
export function flattenToGraph(
    rootLayouts: NestedLayout[],
    meta: Pick<PageGraph, 'pageId' | 'version' | 'status' | 'createdAt'>,
): PageGraph {
    const layouts: Record<string, FlatLayout> = {};
    const slots: Record<string, FlatSlot> = {};

    function visitLayout(
        layout: NestedLayout,
        parentSlotId: string | null,
    ): void {
        layouts[layout.id] = {
            id: layout.id,
            type: layout.type,
            label: layout.label,
            props: layout.props,
            spacing: layout.spacing,
            slotIds: layout.slots.map(s => s.id),
            parentSlotId,
            ...(layout.gridColWidths !== undefined
                ? { gridColWidths: layout.gridColWidths }
                : {}),
            ...(layout.gridRowHeights !== undefined
                ? { gridRowHeights: layout.gridRowHeights }
                : {}),
            ...(layout.gridColGap !== undefined
                ? { gridColGap: layout.gridColGap }
                : {}),
            ...(layout.gridRowGap !== undefined
                ? { gridRowGap: layout.gridRowGap }
                : {}),
        };
        for (const slot of layout.slots) {
            slots[slot.id] = {
                id: slot.id,
                childIds: slot.children.map(c => c.id),
                parentLayoutId: layout.id,
                ...(slot.flexBasis !== undefined
                    ? { flexBasis: slot.flexBasis }
                    : {}),
            };
            for (const child of slot.children) {
                visitLayout(child, slot.id);
            }
        }
    }

    for (const layout of rootLayouts) {
        visitLayout(layout, null);
    }

    return { ...meta, rootOrder: rootLayouts.map(l => l.id), layouts, slots };
}

// ─────────────────────────────────────────────────────────────
// 以下為「協同編輯」預留基礎建設，目前尚未接入。
//
// 設計用途：
//   - applyOperation：將單一 PageOperation 純函式地套用到 PageGraph，
//     不 mutate 原物件，適合搭配 WebSocket / CRDT 使用。
//   - removeLayoutDeep：applyOperation 的內部輔助，遞迴刪除 layout 及
//     其所有子 slots / layouts。
//
// 預計接入時機：
//   1. 多人協同編輯（伺服器廣播 op → client applyOperation）
//   2. Undo / Redo（本地 opLog replay）
//
// ─────────────────────────────────────────────────────────────

/** @internal 遞迴刪除 layout 及其所有子 slot / layout */
function removeLayoutDeep(
    graph: PageGraph,
    layoutId: string,
): { layouts: Record<string, FlatLayout>; slots: Record<string, FlatSlot> } {
    const layouts = { ...graph.layouts };
    const slots = { ...graph.slots };

    function del(id: string) {
        const l = layouts[id];
        if (!l) return;
        for (const sId of l.slotIds) {
            const s = slots[sId];
            if (s) {
                for (const cId of s.childIds) del(cId);
                delete slots[sId];
            }
        }
        delete layouts[id];
    }
    del(layoutId);
    return { layouts, slots };
}

/**
 * 將 PageOperation 套用到 PageGraph，回傳新 graph（pure，不 mutate 原物件）。
 *
 * @remarks
 * **尚未接入** — 保留供未來協同編輯 / undo-redo 使用。
 * 呼叫端負責維護 opLog 與 seq 順序；此函式本身不處理衝突解決。
 *
 * @example
 * ```ts
 * const nextGraph = applyOperation(currentGraph, {
 *   type: 'UPDATE_SLOT_WIDTHS',
 *   layoutId: 'abc',
 *   widths: [30, 70],
 *   seq: 42,
 *   clientId: 'user-1',
 * });
 * ```
 */
export function applyOperation(graph: PageGraph, op: PageOperation): PageGraph {
    switch (op.type) {
        case 'INSERT_LAYOUT': {
            const layouts = {
                ...graph.layouts,
                [op.layout.id]: {
                    ...op.layout,
                    parentSlotId:
                        op.targetSlotId === 'root' ? null : op.targetSlotId,
                },
            };
            if (op.targetSlotId === 'root') {
                const next = [...graph.rootOrder];
                next.splice(op.atIndex, 0, op.layout.id);
                return { ...graph, layouts, rootOrder: next };
            }
            const slot = graph.slots[op.targetSlotId];
            if (!slot) return graph;
            const childIds = [...slot.childIds];
            childIds.splice(op.atIndex, 0, op.layout.id);
            return {
                ...graph,
                layouts,
                slots: {
                    ...graph.slots,
                    [op.targetSlotId]: { ...slot, childIds },
                },
            };
        }

        case 'REMOVE_LAYOUT': {
            const layout = graph.layouts[op.layoutId];
            if (!layout) return graph;
            const { layouts, slots } = removeLayoutDeep(graph, op.layoutId);
            if (layout.parentSlotId === null) {
                return {
                    ...graph,
                    layouts,
                    slots,
                    rootOrder: graph.rootOrder.filter(id => id !== op.layoutId),
                };
            }
            const parentSlot = slots[layout.parentSlotId];
            if (!parentSlot) return { ...graph, layouts, slots };
            return {
                ...graph,
                layouts,
                slots: {
                    ...slots,
                    [layout.parentSlotId]: {
                        ...parentSlot,
                        childIds: parentSlot.childIds.filter(
                            id => id !== op.layoutId,
                        ),
                    },
                },
            };
        }

        case 'MOVE_LAYOUT': {
            const layout = graph.layouts[op.layoutId];
            if (!layout) return graph;
            let rootOrder = graph.rootOrder;
            let slots = { ...graph.slots };
            if (op.fromContainerId === 'root') {
                rootOrder = rootOrder.filter(id => id !== op.layoutId);
            } else {
                const src = slots[op.fromContainerId];
                if (src)
                    slots = {
                        ...slots,
                        [op.fromContainerId]: {
                            ...src,
                            childIds: src.childIds.filter(
                                id => id !== op.layoutId,
                            ),
                        },
                    };
            }
            const newParent =
                op.toContainerId === 'root' ? null : op.toContainerId;
            const layouts = {
                ...graph.layouts,
                [op.layoutId]: { ...layout, parentSlotId: newParent },
            };
            if (op.toContainerId === 'root') {
                const next = [...rootOrder];
                next.splice(op.atIndex, 0, op.layoutId);
                return { ...graph, layouts, slots, rootOrder: next };
            }
            const dst = slots[op.toContainerId];
            if (!dst) return graph;
            const childIds = [...dst.childIds];
            childIds.splice(op.atIndex, 0, op.layoutId);
            return {
                ...graph,
                layouts,
                slots: { ...slots, [op.toContainerId]: { ...dst, childIds } },
            };
        }

        case 'REORDER_LAYOUT': {
            if (op.containerId === 'root') {
                const next = [...graph.rootOrder];
                const [item] = next.splice(op.fromIndex, 1);
                next.splice(op.toIndex, 0, item);
                return { ...graph, rootOrder: next };
            }
            const slot = graph.slots[op.containerId];
            if (!slot) return graph;
            const childIds = [...slot.childIds];
            const [item] = childIds.splice(op.fromIndex, 1);
            childIds.splice(op.toIndex, 0, item);
            return {
                ...graph,
                slots: {
                    ...graph.slots,
                    [op.containerId]: { ...slot, childIds },
                },
            };
        }

        case 'UPDATE_SPACING': {
            const layout = graph.layouts[op.layoutId];
            if (!layout) return graph;
            return {
                ...graph,
                layouts: {
                    ...graph.layouts,
                    [op.layoutId]: { ...layout, spacing: op.spacing },
                },
            };
        }

        case 'ADD_SLOT': {
            const layout = graph.layouts[op.slot.parentLayoutId];
            if (!layout) return graph;
            return {
                ...graph,
                layouts: {
                    ...graph.layouts,
                    [layout.id]: {
                        ...layout,
                        slotIds: [...layout.slotIds, op.slot.id],
                    },
                },
                slots: { ...graph.slots, [op.slot.id]: op.slot },
            };
        }

        case 'REMOVE_SLOT': {
            const layout = graph.layouts[op.layoutId];
            if (!layout) return graph;
            const { [op.slotId]: _removed, ...restSlots } = graph.slots;
            return {
                ...graph,
                layouts: {
                    ...graph.layouts,
                    [op.layoutId]: {
                        ...layout,
                        slotIds: layout.slotIds.filter(id => id !== op.slotId),
                    },
                },
                slots: restSlots,
            };
        }

        case 'UPDATE_SLOT_WIDTHS': {
            const layout = graph.layouts[op.layoutId];
            if (!layout) return graph;
            const updatedSlots = { ...graph.slots };
            layout.slotIds.forEach((slotId, i) => {
                if (op.widths[i] !== undefined && updatedSlots[slotId]) {
                    updatedSlots[slotId] = {
                        ...updatedSlots[slotId],
                        flexBasis: op.widths[i],
                    };
                }
            });
            return { ...graph, slots: updatedSlots };
        }

        case 'UPDATE_GRID_DIMENSIONS': {
            const layout = graph.layouts[op.layoutId];
            if (!layout) return graph;
            return {
                ...graph,
                layouts: {
                    ...graph.layouts,
                    [op.layoutId]: {
                        ...layout,
                        gridColWidths: op.colWidths,
                        gridRowHeights: op.rowHeights,
                        ...(op.colGap !== undefined
                            ? { gridColGap: op.colGap }
                            : {}),
                        ...(op.rowGap !== undefined
                            ? { gridRowGap: op.rowGap }
                            : {}),
                    },
                },
            };
        }

        default:
            return graph;
    }
}

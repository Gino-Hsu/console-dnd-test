import type {
    FlatLayout,
    FlatSlot,
    FlatComponent,
    NestedLayout,
    CanvasNode,
    PageGraph,
} from '@/types/layout';
import { isLayoutNode } from '@/types/layout';

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
    const components: Record<string, FlatComponent> = {};

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
            flexConfig: layout.flexConfig,
            gridConfig: layout.gridConfig,
        };
        for (const slot of layout.slots) {
            slots[slot.id] = {
                id: slot.id,
                childIds: slot.children.map(c => c.id),
                parentLayoutId: layout.id,
                flexWidthConfig: {
                    flexBasis: slot.flexWidthConfig.flexBasis || null,
                    widthPx: slot.flexWidthConfig.widthPx || null,
                },
                align: slot.align,
            };
            for (const child of slot.children) {
                if (isLayoutNode(child)) {
                    visitLayout(child, slot.id);
                } else {
                    // 處理 ComponentNode
                    components[child.id] = {
                        id: child.id,
                        componentId: child.componentId,
                        label: child.label,
                        data: child.data,
                        style: child.style,
                        parentSlotId: slot.id,
                    };
                }
            }
        }
    }

    for (const layout of rootLayouts) {
        visitLayout(layout, null);
    }

    return {
        ...meta,
        rootOrder: rootLayouts.map(l => l.id),
        layouts,
        slots,
        components,
    };
}

/**
 * 將 PageGraph 還原成 NestedLayout[]（樹狀結構）
 * 用於從 API 讀取扁平資料後，轉回 editor 的工作格式
 */
export function graphToTree(graph: PageGraph): NestedLayout[] {
    function buildNode(id: string): CanvasNode {
        // 先檢查是否為 Layout
        const flat = graph.layouts[id];
        if (flat) {
            const slots = flat.slotIds.map(slotId => {
                const flatSlot = graph.slots[slotId];
                if (!flatSlot)
                    throw new Error(`graphToTree: slot "${slotId}" not found`);
                return {
                    id: flatSlot.id,
                    children: flatSlot.childIds.map(childId =>
                        buildNode(childId),
                    ),
                    flexWidthConfig: {
                        flexBasis: flatSlot.flexWidthConfig.flexBasis ?? 50,
                        widthPx: flatSlot.flexWidthConfig.widthPx ?? 200,
                    },
                    align: flatSlot.align,
                };
            });

            return {
                id: flat.id,
                type: flat.type,
                label: flat.label,
                props: flat.props,
                spacing: flat.spacing,
                slots,
                flexConfig: flat.flexConfig ?? null,
                gridConfig: flat.gridConfig ?? null,
            };
        }

        // 否則處理 Component
        const component = graph.components[id];
        if (component) {
            return {
                id: component.id,
                type: 'component',
                componentId: component.componentId,
                label: component.label,
                data: component.data,
                style: component.style,
            };
        }

        throw new Error(`graphToTree: node "${id}" not found`);
    }

    return graph.rootOrder.map(id => buildNode(id) as NestedLayout);
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

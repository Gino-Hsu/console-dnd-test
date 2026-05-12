import type {
    FlatLayout,
    FlatSlot,
    FlatModule,
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
    const modules: Record<string, FlatModule> = {};

    function visitLayout(
        layout: NestedLayout,
        parentSlotId: string | null,
    ): void {
        layouts[layout.id] = {
            id: layout.id,
            type: layout.type,
            layoutType: layout.layoutType,
            label: layout.label,
            props: layout.props,
            spacing: layout.spacing,
            slotIds: layout.slots.map(s => s.id),
            parentSlotId,
            flexConfig: layout.flexConfig,
            gridConfig: layout.gridConfig,
            containerWidth: layout.containerWidth,
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
                    // 處理 ModuleNode
                    modules[child.id] = {
                        id: child.id,
                        type: 'module',
                        moduleId: child.moduleId,
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
        modules,
    };
}

/**
 * 將 PageGraph 還原成 NestedLayout[]（樹狀結構）
 * 用於從 API 讀取扁平資料後，轉回 editor 的工作格式
 */
export function graphToTree(graph: PageGraph): NestedLayout[] {
    function buildNode(id: string): CanvasNode {
        // 先檢查是否為 Layout（type 為 LayoutType 之一）
        const layoutItem = graph.layouts[id];

        if (layoutItem && layoutItem.type === 'layout') {
            const slots = layoutItem.slotIds.map(slotId => {
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
                id: layoutItem.id,
                type: 'layout',
                layoutType: layoutItem.layoutType,
                label: layoutItem.label,
                props: layoutItem.props,
                spacing: layoutItem.spacing,
                slots,
                flexConfig: layoutItem.flexConfig ?? null,
                gridConfig: layoutItem.gridConfig ?? null,
                containerWidth: layoutItem.containerWidth,
            };
        }

        // 再檢查是否為 Module
        const moduleItem = graph.modules[id];
        if (moduleItem && moduleItem.type === 'module') {
            return {
                id: moduleItem.id,
                type: 'module',
                moduleId: moduleItem.moduleId,
                label: moduleItem.label,
                data: moduleItem.data,
                style: moduleItem.style,
            };
        }

        throw new Error(`graphToTree: node "${id}" not found`);
    }

    return graph.rootOrder.map(id => buildNode(id) as NestedLayout);
}

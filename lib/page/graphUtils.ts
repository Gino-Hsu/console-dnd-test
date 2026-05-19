import type {
    FlatLayout,
    FlatSlot,
    FlatModule,
    NestedLayout,
    CanvasNode,
    PageGraph,
} from '@/types/layout';
import { isLayoutNode } from '@/types/layout';
import type { ModuleId } from '@/lib/module-registry';

// ─── 轉換 ────────────────────────────────────────────────────

/**
 * 將巢狀 NestedLayout[] 扁平化成 PageGraph
 * 時間複雜度 O(N)，查詢 O(1)，含 parent 引用
 */
export function flattenToGraph(
    rootLayouts: NestedLayout[],
    meta: PageGraph,
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
            carouselConfig: layout.carouselConfig,
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
                    // 處理 ComponentNode
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
export function graphToTree(input: PageGraph): NestedLayout[] {
    const graph = input;

    if (!graph || !graph.rootOrder) {
        console.error('graphToTree: Invalid graph input', input);
        return [];
    }

    function buildNode(id: string): CanvasNode | null {
        // 先檢查是否為 Layout（type 為 LayoutType 之一）
        const layout = graph.layouts[id];

        if (layout && layout.type === 'layout') {
            const slots = (layout.slotIds || [])
                .map(slotId => {
                    const flatSlot = (graph.slots || {})[slotId];
                    if (!flatSlot) {
                        console.warn(
                            `graphToTree: slot "${slotId}" not found in layout "${id}"`,
                        );
                        return null;
                    }
                    return {
                        id: flatSlot.id,
                        children: (flatSlot.childIds || [])
                            .map(childId => buildNode(childId))
                            .filter((n): n is CanvasNode => n !== null),
                        flexWidthConfig: {
                            flexBasis:
                                flatSlot.flexWidthConfig?.flexBasis ?? 50,
                            widthPx: flatSlot.flexWidthConfig?.widthPx ?? 200,
                        },
                        align: flatSlot.align ?? 'left',
                    };
                })
                .filter(s => s !== null);

            return {
                id: layout.id,
                type: 'layout',
                layoutType: layout.layoutType,
                label: layout.label,
                props: layout.props,
                spacing: layout.spacing,
                slots,
                flexConfig: layout.flexConfig ?? null,
                gridConfig: layout.gridConfig ?? null,
                carouselConfig: layout.carouselConfig ?? null,
                containerWidth: layout.containerWidth,
            };
        }

        // 再檢查是否為 Component
        const module = (graph.modules || {})[id];
        if (module && module.type === 'module') {
            return {
                id: module.id,
                type: 'module',
                moduleId: module.moduleId as ModuleId,
                label: module.label,
                data: module.data,
                style: module.style,
            };
        }

        console.warn(`graphToTree: node "${id}" not found`);
        return null;
    }

    return (graph.rootOrder || [])
        .map(id => buildNode(id))
        .filter((n): n is NestedLayout => n !== null && n.type === 'layout');
}

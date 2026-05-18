import type { NestedLayout, EditOperation } from '@/types/layout';
import { isLayoutNode } from '@/types/layout';
import {
    removeItem,
    addSlotToLayout,
    removeSlotFromLayout,
    updateField,
    moveItem,
    insertIntoSlot,
    mapLayouts,
} from './index';

export function applyEditLogAction(
    tree: NestedLayout[],
    operation: EditOperation,
): NestedLayout[] {
    const { type, payload } = operation;
    if (!payload) return tree;

    switch (type) {
        case 'add-layout': {
            const { layout, slotId, ownerId, index } = operation.payload;
            console.log('add-layout', operation);
            if (!layout) return tree;
            if (slotId && ownerId) {
                return insertIntoSlot(
                    tree,
                    ownerId,
                    slotId,
                    layout,
                    index ?? undefined,
                );
            } else {
                const next = [...tree];
                next.splice(index ?? tree.length, 0, layout);
                return next;
            }
        }

        case 'delete-layout': {
            return removeItem(tree, operation.payload.layoutId);
        }

        case 'move-layout': {
            const { layoutId, targetSlotId, index } = operation.payload;
            return moveItem(tree, layoutId, targetSlotId, index ?? undefined);
        }

        case 'update-spacing': {
            const { layoutId, spacing } = operation.payload;
            return updateField(tree, layoutId, { spacing });
        }

        case 'add-slot': {
            return addSlotToLayout(tree, operation.payload.layoutId);
        }

        case 'remove-slot': {
            return removeSlotFromLayout(
                tree,
                operation.payload.layoutId,
                operation.payload.slotId,
            );
        }

        case 'update-slot-widths': {
            const { layoutId, widths } = operation.payload;
            return mapLayouts(tree, l => {
                if (l.id !== layoutId) return l;
                return {
                    ...l,
                    slots: l.slots.map((s, i) => ({
                        ...s,
                        flexWidthConfig: {
                            ...s.flexWidthConfig,
                            flexBasis: widths[i] ?? s.flexWidthConfig.flexBasis,
                        },
                    })),
                };
            });
        }

        case 'update-wrap-slot-width': {
            const { layoutId, slotId, widthPx } = operation.payload;
            return mapLayouts(tree, l => {
                if (l.id !== layoutId) return l;
                return {
                    ...l,
                    slots: l.slots.map(s =>
                        s.id === slotId
                            ? {
                                  ...s,
                                  flexWidthConfig: {
                                      ...s.flexWidthConfig,
                                      widthPx,
                                  },
                              }
                            : s,
                    ),
                };
            });
        }

        case 'update-grid-dimensions': {
            const { layoutId, colWidths, rowHeights, colGap, rowGap } =
                operation.payload;
            return mapLayouts(tree, l => {
                if (l.id !== layoutId) return l;
                return {
                    ...l,
                    gridConfig: {
                        colWidths,
                        rowHeights,
                        colGap: colGap ?? l.gridConfig?.colGap ?? 8,
                        rowGap: rowGap ?? l.gridConfig?.rowGap ?? 8,
                    },
                };
            });
        }

        case 'update-flex-gap': {
            const { layoutId, gap } = operation.payload;
            return mapLayouts(tree, l =>
                l.id === layoutId
                    ? { ...l, flexConfig: { ...l.flexConfig!, gap } }
                    : l,
            );
        }

        case 'update-flex-wrap': {
            const { layoutId, wrap } = operation.payload;
            return mapLayouts(tree, l =>
                l.id === layoutId
                    ? { ...l, flexConfig: { ...l.flexConfig!, wrap } }
                    : l,
            );
        }

        case 'update-flex-row-gap': {
            const { layoutId, rowGap } = operation.payload;
            return mapLayouts(tree, l =>
                l.id === layoutId
                    ? { ...l, flexConfig: { ...l.flexConfig!, rowGap } }
                    : l,
            );
        }

        case 'update-slot-align': {
            const { layoutId, slotId, align } = operation.payload;
            return mapLayouts(tree, l => {
                if (l.id !== layoutId) return l;
                return {
                    ...l,
                    slots: l.slots.map(s =>
                        s.id === slotId ? { ...s, align } : s,
                    ),
                };
            });
        }

        case 'update-container-width': {
            const { layoutId, containerWidth } = operation.payload;
            return mapLayouts(tree, l =>
                l.id === layoutId ? { ...l, containerWidth } : l,
            );
        }

        case 'update-carousel-config': {
            const { layoutId, carouselConfig } = operation.payload;
            return mapLayouts(tree, l =>
                l.id === layoutId ? { ...l, carouselConfig } : l,
            );
        }

        case 'add-module': {
            const { module, slotId, ownerId, index } = operation.payload;
            return insertIntoSlot(
                tree,
                ownerId,
                slotId,
                module,
                index ?? undefined,
            );
        }

        case 'update-module': {
            const { moduleId, data, style } = operation.payload;
            return mapLayouts(tree, l => ({
                ...l,
                slots: l.slots.map(s => ({
                    ...s,
                    children: s.children.map(c => {
                        if (c.id !== moduleId || isLayoutNode(c)) return c;
                        return {
                            ...c,
                            data: data ?? c.data,
                            style: style ?? c.style,
                        };
                    }),
                })),
            }));
        }

        default:
            return tree;
    }
}

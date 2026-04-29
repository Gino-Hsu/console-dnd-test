import { useCallback, useState } from 'react';
import {
    createLayout,
    insertIntoSlot,
    moveItem,
    removeItem,
    addSlotToLayout,
    removeSlotFromLayout,
    updateField,
    mapLayouts,
    findLayout,
} from '@/lib/layout';
import type { LayoutSpacing, LayoutType, NestedLayout } from '@/types/layout';
import { graphToTree } from '@/lib/layout';
import { MOCK_PAGE_GRAPH } from '@/app/mockData';

export function useLayoutEditor() {
    const [layouts, setLayouts] = useState<NestedLayout[]>(() =>
        graphToTree(MOCK_PAGE_GRAPH),
    );
    const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(
        null,
    );

    const selectedLayout = selectedLayoutId
        ? findLayout(selectedLayoutId, layouts)
        : null;

    const handleRemove = useCallback((id: string) => {
        setLayouts(prev => removeItem(prev, id));
        setSelectedLayoutId(null);
    }, []);

    const handleSelect = useCallback((id: string) => {
        setSelectedLayoutId(prev => (prev === id ? null : id));
    }, []);

    const handleAddSlot = useCallback((layoutId: string) => {
        setLayouts(prev => addSlotToLayout(prev, layoutId));
    }, []);

    const handleRemoveSlot = useCallback((layoutId: string, slotId: string) => {
        setLayouts(prev => removeSlotFromLayout(prev, layoutId, slotId));
    }, []);

    const handleUpdateSpacing = useCallback(
        (layoutId: string, spacing: LayoutSpacing) => {
            setLayouts(prev => updateField(prev, layoutId, { spacing }));
        },
        [],
    );

    const handleUpdateSlotWidths = useCallback(
        (layoutId: string, widths: number[]) => {
            setLayouts(prev =>
                mapLayouts(prev, l => {
                    if (l.id !== layoutId) return l;
                    return {
                        ...l,
                        slots: l.slots.map((s, i) => ({
                            ...s,
                            flexWidthConfig: {
                                ...s.flexWidthConfig,
                                flexBasis:
                                    widths[i] ?? s.flexWidthConfig.flexBasis,
                            },
                        })),
                    };
                }),
            );
        },
        [],
    );

    const handleUpdateWrapSlotWidth = useCallback(
        (layoutId: string, slotId: string, widthPx: number) => {
            setLayouts(prev =>
                mapLayouts(prev, l => {
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
                }),
            );
        },
        [],
    );

    const handleUpdateGridDimensions = useCallback(
        (
            layoutId: string,
            colWidths: number[],
            rowHeights: number[],
            colGap: number | null,
            rowGap: number | null,
        ) => {
            setLayouts(prev =>
                mapLayouts(prev, l => {
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
                }),
            );
        },
        [],
    );

    const handleUpdateFlexGap = useCallback((layoutId: string, gap: number) => {
        setLayouts(prev =>
            mapLayouts(prev, l =>
                l.id === layoutId
                    ? { ...l, flexConfig: { ...l.flexConfig!, gap } }
                    : l,
            ),
        );
    }, []);

    const handleUpdateFlexWrap = useCallback(
        (layoutId: string, wrap: boolean) => {
            setLayouts(prev =>
                mapLayouts(prev, l =>
                    l.id === layoutId
                        ? { ...l, flexConfig: { ...l.flexConfig!, wrap } }
                        : l,
                ),
            );
        },
        [],
    );

    const handleUpdateFlexRowGap = useCallback(
        (layoutId: string, rowGap: number) => {
            setLayouts(prev =>
                mapLayouts(prev, l =>
                    l.id === layoutId
                        ? { ...l, flexConfig: { ...l.flexConfig!, rowGap } }
                        : l,
                ),
            );
        },
        [],
    );

    const applyMove = useCallback(
        (
            activeId: string,
            targetContainer: string,
            index: number | null | undefined,
        ) => {
            setLayouts(prev =>
                moveItem(prev, activeId, targetContainer, index ?? undefined),
            );
        },
        [],
    );

    const applySidebarDrop = useCallback(
        (
            type: LayoutType,
            label: string,
            target:
                | { type: 'slot'; ownerId: string; slotId: string }
                | { type: 'canvas' },
            index: number | null,
        ) => {
            const newLayout = createLayout(type, label);
            if (target.type === 'slot') {
                setLayouts(prev =>
                    insertIntoSlot(
                        prev,
                        target.ownerId,
                        target.slotId,
                        newLayout,
                        index ?? undefined,
                    ),
                );
            } else {
                setLayouts(prev => {
                    const next = [...prev];
                    next.splice(index ?? prev.length, 0, newLayout);
                    return next;
                });
            }
        },
        [],
    );

    return {
        layouts,
        setLayouts,
        selectedLayoutId,
        selectedLayout,
        handleRemove,
        handleSelect,
        handleAddSlot,
        handleRemoveSlot,
        handleUpdateSpacing,
        handleUpdateSlotWidths,
        handleUpdateWrapSlotWidth,
        handleUpdateGridDimensions,
        handleUpdateFlexGap,
        handleUpdateFlexWrap,
        handleUpdateFlexRowGap,
        applyMove,
        applySidebarDrop,
        deselectLayout: () => setSelectedLayoutId(null),
    };
}

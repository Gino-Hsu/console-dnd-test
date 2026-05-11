import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
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
import type {
    LayoutSpacing,
    LayoutType,
    NestedLayout,
    SlotAlign,
    PageGraph,
} from '@/types/layout';
import { graphToTree, flattenToGraph } from '@/lib/layout';
import { getPageGraph, getDraft, saveDraft } from '@/app/api/pageGraph';

const AUTOSAVE_DELAY_MS = 3000;

export function useLayoutEditor() {
    // SSOT: 以扁平的 PageGraph 作為唯一狀態來源
    const [graph, setGraph] = useState<PageGraph | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(
        null,
    );
    const [isSaving, setIsSaving] = useState(false);
    const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isInitialLoadRef = useRef(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setIsLoading(true);
                setLoadError(null);

                // 優先讀草稿；若無則讀已發布頁面並建立草稿
                let draft = await getDraft();
                if (!draft) {
                    const published = await getPageGraph();
                    draft = { ...published, status: 'draft' };
                    await saveDraft(draft);
                }

                if (!cancelled) {
                    setGraph(draft);
                }
            } catch (err) {
                if (!cancelled) {
                    setLoadError(String(err));
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                    isInitialLoadRef.current = false;
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    // Auto-save: debounce 3s after every graph change (skip initial load)
    useEffect(() => {
        if (isInitialLoadRef.current || !graph) return;

        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = setTimeout(async () => {
            try {
                setIsSaving(true);
                await saveDraft(graph);
            } catch (err) {
                console.warn('[autosave] failed:', err);
            } finally {
                setIsSaving(false);
            }
        }, AUTOSAVE_DELAY_MS);

        return () => {
            if (autosaveTimerRef.current)
                clearTimeout(autosaveTimerRef.current);
        };
    }, [graph]);

    // Selector: 動態產出 tree 供畫面渲染
    const layouts = useMemo(() => {
        return graph ? graphToTree(graph) : [];
    }, [graph]);

    // Updater: 修改 tree 然後同步回 graph (維持舊有 API 相容性)
    const setLayouts = useCallback(
        (
            updater:
                | NestedLayout[]
                | ((prev: NestedLayout[]) => NestedLayout[]),
        ) => {
            setGraph(prevGraph => {
                if (!prevGraph) return prevGraph;
                const currentTree = graphToTree(prevGraph);
                const nextTree =
                    typeof updater === 'function'
                        ? updater(currentTree)
                        : updater;
                return flattenToGraph(nextTree, {
                    pageId: prevGraph.pageId,
                    version: prevGraph.version,
                    status: prevGraph.status,
                    createdAt: prevGraph.createdAt,
                });
            });
        },
        [setGraph],
    );

    const selectedLayout = selectedLayoutId
        ? findLayout(selectedLayoutId, layouts)
        : null;

    const handleRemove = useCallback(
        (id: string) => {
            setLayouts(prev => removeItem(prev, id));
            setSelectedLayoutId(null);
        },
        [setLayouts, setSelectedLayoutId],
    );

    const handleSelect = useCallback(
        (id: string) => {
            setSelectedLayoutId(prev => (prev === id ? null : id));
        },
        [setSelectedLayoutId],
    );

    const handleAddSlot = useCallback(
        (layoutId: string) => {
            setLayouts(prev => addSlotToLayout(prev, layoutId));
        },
        [setLayouts],
    );

    const handleRemoveSlot = useCallback(
        (layoutId: string, slotId: string) => {
            setLayouts(prev => removeSlotFromLayout(prev, layoutId, slotId));
        },
        [setLayouts],
    );

    const handleUpdateSpacing = useCallback(
        (layoutId: string, spacing: LayoutSpacing) => {
            setLayouts(prev => updateField(prev, layoutId, { spacing }));
        },
        [setLayouts],
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
        [setLayouts],
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
        [setLayouts],
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
        [setLayouts],
    );

    const handleUpdateFlexGap = useCallback(
        (layoutId: string, gap: number) => {
            setLayouts(prev =>
                mapLayouts(prev, l =>
                    l.id === layoutId
                        ? { ...l, flexConfig: { ...l.flexConfig!, gap } }
                        : l,
                ),
            );
        },
        [setLayouts],
    );

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
        [setLayouts],
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
        [setLayouts],
    );

    const handleUpdateSlotAlign = useCallback(
        (layoutId: string, slotId: string, align: SlotAlign) => {
            setLayouts(prev =>
                mapLayouts(prev, l => {
                    if (l.id !== layoutId) return l;
                    return {
                        ...l,
                        slots: l.slots.map(s =>
                            s.id === slotId ? { ...s, align } : s,
                        ),
                    };
                }),
            );
        },
        [setLayouts],
    );

    const handleUpdateContainerWidth = useCallback(
        (layoutId: string, containerWidth: 'full' | 'contained') => {
            setLayouts(prev =>
                mapLayouts(prev, l =>
                    l.id === layoutId ? { ...l, containerWidth } : l,
                ),
            );
        },
        [setLayouts],
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
        [setLayouts],
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
        [setLayouts],
    );

    return {
        graph,
        layouts,
        setLayouts,
        isLoading,
        loadError,
        isSaving,
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
        handleUpdateSlotAlign,
        handleUpdateContainerWidth,
        applyMove,
        applySidebarDrop,
        deselectLayout: () => setSelectedLayoutId(null),
    };
}

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
import {
    getLatestPage,
    getLatestEditLog,
    appendEditLog,
} from '@/app/api/pageGraph';

const AUTOSAVE_DELAY_MS = 3000;

// Type shared with useDndBuilder and useComponentEditor
export type LoggedSetLayouts = (
    updater: NestedLayout[] | ((prev: NestedLayout[]) => NestedLayout[]),
    action: string,
    description: string,
    immediate?: boolean,
) => void;

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
    const pendingLogRef = useRef<{
        action: string;
        description: string;
        immediate: boolean;
    } | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setIsLoading(true);
                setLoadError(null);

                // 優先讀最新的 editLog；若無則讀最新發布版本
                let graph = await getLatestEditLog();
                if (!graph) {
                    graph = await getLatestPage();
                }

                if (!cancelled) {
                    setGraph(graph);
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

    // EditLog dispatch: fires after each graph change (skip initial load)
    useEffect(() => {
        if (isInitialLoadRef.current || !graph) return;

        const pending = pendingLogRef.current;
        pendingLogRef.current = null;

        const action = pending?.action ?? 'edit';
        const description = pending?.description ?? '編輯';
        const immediate = pending?.immediate ?? false;

        if (immediate) {
            if (autosaveTimerRef.current)
                clearTimeout(autosaveTimerRef.current);
            setIsSaving(true);
            appendEditLog(graph, action, description)
                .catch(err => console.warn('[editLog] failed:', err))
                .finally(() => setIsSaving(false));
        } else {
            if (autosaveTimerRef.current)
                clearTimeout(autosaveTimerRef.current);
            autosaveTimerRef.current = setTimeout(async () => {
                try {
                    setIsSaving(true);
                    await appendEditLog(graph, action, description);
                } catch (err) {
                    console.warn('[editLog] failed:', err);
                } finally {
                    setIsSaving(false);
                }
            }, AUTOSAVE_DELAY_MS);
        }

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

    // setLayouts + queues an editLog entry
    const setLayoutsWithLog: LoggedSetLayouts = useCallback(
        (updater, action, description, immediate = false) => {
            pendingLogRef.current = { action, description, immediate };
            setLayouts(updater);
        },
        [setLayouts],
    );

    const selectedLayout = selectedLayoutId
        ? findLayout(selectedLayoutId, layouts)
        : null;

    const handleRemove = useCallback(
        (id: string) => {
            setLayoutsWithLog(
                prev => removeItem(prev, id),
                'remove-layout',
                '刪除 Layout',
                true,
            );
            setSelectedLayoutId(null);
        },
        [setLayoutsWithLog, setSelectedLayoutId],
    );

    const handleSelect = useCallback(
        (id: string) => {
            setSelectedLayoutId(prev => (prev === id ? null : id));
        },
        [setSelectedLayoutId],
    );

    const handleAddSlot = useCallback(
        (layoutId: string) => {
            setLayoutsWithLog(
                prev => addSlotToLayout(prev, layoutId),
                'add-slot',
                '新增 Slot',
                true,
            );
        },
        [setLayoutsWithLog],
    );

    const handleRemoveSlot = useCallback(
        (layoutId: string, slotId: string) => {
            setLayoutsWithLog(
                prev => removeSlotFromLayout(prev, layoutId, slotId),
                'remove-slot',
                '刪除 Slot',
                true,
            );
        },
        [setLayoutsWithLog],
    );

    const handleUpdateSpacing = useCallback(
        (layoutId: string, spacing: LayoutSpacing) => {
            setLayoutsWithLog(
                prev => updateField(prev, layoutId, { spacing }),
                'edit-layout',
                '調整間距',
            );
        },
        [setLayoutsWithLog],
    );

    const handleUpdateSlotWidths = useCallback(
        (layoutId: string, widths: number[]) => {
            setLayoutsWithLog(
                prev =>
                    mapLayouts(prev, l => {
                        if (l.id !== layoutId) return l;
                        return {
                            ...l,
                            slots: l.slots.map((s, i) => ({
                                ...s,
                                flexWidthConfig: {
                                    ...s.flexWidthConfig,
                                    flexBasis:
                                        widths[i] ??
                                        s.flexWidthConfig.flexBasis,
                                },
                            })),
                        };
                    }),
                'edit-slot',
                '調整欄寬',
            );
        },
        [setLayoutsWithLog],
    );

    const handleUpdateWrapSlotWidth = useCallback(
        (layoutId: string, slotId: string, widthPx: number) => {
            setLayoutsWithLog(
                prev =>
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
                'edit-slot',
                '調整欄寬',
            );
        },
        [setLayoutsWithLog],
    );

    const handleUpdateGridDimensions = useCallback(
        (
            layoutId: string,
            colWidths: number[],
            rowHeights: number[],
            colGap: number | null,
            rowGap: number | null,
        ) => {
            setLayoutsWithLog(
                prev =>
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
                'edit-layout',
                '調整 Grid',
            );
        },
        [setLayoutsWithLog],
    );

    const handleUpdateFlexGap = useCallback(
        (layoutId: string, gap: number) => {
            setLayoutsWithLog(
                prev =>
                    mapLayouts(prev, l =>
                        l.id === layoutId
                            ? { ...l, flexConfig: { ...l.flexConfig!, gap } }
                            : l,
                    ),
                'edit-layout',
                '調整 Flex 間距',
            );
        },
        [setLayoutsWithLog],
    );

    const handleUpdateFlexWrap = useCallback(
        (layoutId: string, wrap: boolean) => {
            setLayoutsWithLog(
                prev =>
                    mapLayouts(prev, l =>
                        l.id === layoutId
                            ? { ...l, flexConfig: { ...l.flexConfig!, wrap } }
                            : l,
                    ),
                'edit-layout',
                '調整 Flex 換行',
            );
        },
        [setLayoutsWithLog],
    );

    const handleUpdateFlexRowGap = useCallback(
        (layoutId: string, rowGap: number) => {
            setLayoutsWithLog(
                prev =>
                    mapLayouts(prev, l =>
                        l.id === layoutId
                            ? { ...l, flexConfig: { ...l.flexConfig!, rowGap } }
                            : l,
                    ),
                'edit-layout',
                '調整 Flex 行距',
            );
        },
        [setLayoutsWithLog],
    );

    const handleUpdateSlotAlign = useCallback(
        (layoutId: string, slotId: string, align: SlotAlign) => {
            setLayoutsWithLog(
                prev =>
                    mapLayouts(prev, l => {
                        if (l.id !== layoutId) return l;
                        return {
                            ...l,
                            slots: l.slots.map(s =>
                                s.id === slotId ? { ...s, align } : s,
                            ),
                        };
                    }),
                'edit-slot',
                '調整對齊方式',
            );
        },
        [setLayoutsWithLog],
    );

    const handleUpdateContainerWidth = useCallback(
        (layoutId: string, containerWidth: 'full' | 'contained') => {
            setLayoutsWithLog(
                prev =>
                    mapLayouts(prev, l =>
                        l.id === layoutId ? { ...l, containerWidth } : l,
                    ),
                'edit-layout',
                '調整容器寬度',
            );
        },
        [setLayoutsWithLog],
    );

    const applyMove = useCallback(
        (
            activeId: string,
            targetContainer: string,
            index: number | null | undefined,
        ) => {
            setLayoutsWithLog(
                prev =>
                    moveItem(
                        prev,
                        activeId,
                        targetContainer,
                        index ?? undefined,
                    ),
                'move',
                '移動項目',
                true,
            );
        },
        [setLayoutsWithLog],
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
                setLayoutsWithLog(
                    prev =>
                        insertIntoSlot(
                            prev,
                            target.ownerId,
                            target.slotId,
                            newLayout,
                            index ?? undefined,
                        ),
                    'add-layout',
                    `新增 ${label}`,
                    true,
                );
            } else {
                setLayoutsWithLog(
                    prev => {
                        const next = [...prev];
                        next.splice(index ?? prev.length, 0, newLayout);
                        return next;
                    },
                    'add-layout',
                    `新增 ${label}`,
                    true,
                );
            }
        },
        [setLayoutsWithLog],
    );

    return {
        graph,
        layouts,
        setLayouts: setLayoutsWithLog,
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

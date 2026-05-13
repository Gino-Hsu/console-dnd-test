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
    graphToTree,
    flattenToGraph,
    applyEditLogAction,
} from '@/lib/page';
import type {
    LayoutSpacing,
    LayoutType,
    NestedLayout,
    SlotAlign,
    PageGraph,
    EditOperation,
} from '@/types/layout';

import { getCurrentPage, appendEditLog } from '@/lib/api/page';

const AUTOSAVE_DELAY_MS = 3000;

// Type shared with useDndBuilder and useComponentEditor
export type LoggedSetLayouts = (
    updater: NestedLayout[] | ((prev: NestedLayout[]) => NestedLayout[]),
    action: EditOperation['type'],
    description: string,
    immediate?: boolean,
    payload?: EditOperation['payload'],
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

                // 取得基礎發布版與尚未發布的編輯紀錄
                const { base, editLogs } = await getCurrentPage();

                console.log('base', base);
                console.log('editLogs', editLogs);

                // base 直接就是 PageGraph，不再有嵌套的 .graph
                let tree = graphToTree(base as unknown as PageGraph);
                // 依序套用編輯紀錄
                for (const operation of editLogs) {
                    tree = applyEditLogAction(tree, operation);
                }

                console.log('tree', tree);

                const restoredGraph = flattenToGraph(
                    tree,
                    base as unknown as PageGraph,
                );

                if (!cancelled) {
                    setGraph(restoredGraph);
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

    // Debounced log helper
    const logTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const performLog = useCallback(
        (operation: EditOperation, immediate: boolean) => {
            if (immediate) {
                if (logTimerRef.current) clearTimeout(logTimerRef.current);
                setIsSaving(true);
                appendEditLog(operation)
                    .catch(err => console.warn('[editLog] failed:', err))
                    .finally(() => setIsSaving(false));
            } else {
                if (logTimerRef.current) clearTimeout(logTimerRef.current);
                logTimerRef.current = setTimeout(async () => {
                    try {
                        setIsSaving(true);
                        await appendEditLog(operation);
                    } catch (err) {
                        console.warn('[editLog] failed:', err);
                    } finally {
                        setIsSaving(false);
                    }
                }, AUTOSAVE_DELAY_MS);
            }
        },
        [],
    );

    // EffectLog dispatch: no longer needed as a separate effect
    // We'll call performLog directly in setLayoutsWithLog

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
                return flattenToGraph(nextTree, prevGraph);
            });
        },
        [setGraph],
    );

    // setLayouts + queues an editLog entry
    const setLayoutsWithLog: LoggedSetLayouts = useCallback(
        (updater, action, description, immediate = false, payload) => {
            // 1. 更新本地狀態
            setLayouts(updater);

            // 2. 記錄操作日誌 (不再記錄整個 graph)
            performLog(
                {
                    type: action,
                    label: description,
                    payload,
                } as unknown as EditOperation,
                immediate,
            );
        },
        [setLayouts, performLog],
    );

    const selectedLayout = selectedLayoutId
        ? findLayout(selectedLayoutId, layouts)
        : null;

    const handleRemove = useCallback(
        (id: string) => {
            setLayoutsWithLog(
                prev => removeItem(prev, id),
                'delete-layout',
                '刪除 Layout',
                true,
                { layoutId: id },
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
                { layoutId },
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
                { layoutId, slotId },
            );
        },
        [setLayoutsWithLog],
    );

    const handleUpdateSpacing = useCallback(
        (layoutId: string, spacing: LayoutSpacing) => {
            setLayoutsWithLog(
                prev => updateField(prev, layoutId, { spacing }),
                'update-spacing',
                '調整間距',
                false,
                { layoutId, spacing },
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
                'update-slot-widths',
                '調整欄寬',
                false,
                { layoutId, widths },
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
                'update-wrap-slot-width',
                '調整欄寬',
                false,
                { layoutId, slotId, widthPx },
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
                'update-grid-dimensions',
                '調整 Grid',
                false,
                { layoutId, colWidths, rowHeights, colGap, rowGap },
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
                'update-flex-gap',
                '調整 Flex 間距',
                false,
                { layoutId, gap },
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
                'update-flex-wrap',
                '調整 Flex 換行',
                false,
                { layoutId, wrap },
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
                'update-flex-row-gap',
                '調整 Flex 行距',
                false,
                { layoutId, rowGap },
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
                'update-slot-align',
                '調整對齊方式',
                false,
                { layoutId, slotId, align },
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
                'update-container-width',
                '調整容器寬度',
                false,
                { layoutId, containerWidth },
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
                'move-layout',
                '移動項目',
                true,
                { layoutId: activeId, targetSlotId: targetContainer, index },
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
                    {
                        layout: newLayout,
                        slotId: target.slotId,
                        ownerId: target.ownerId,
                        index,
                    },
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
                    { layout: newLayout, index },
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

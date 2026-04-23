'use client';

import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    pointerWithin,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import CanvasArea from './CanvasArea';
import {
    createLayout,
    findContainer,
    findLayoutById,
    insertIntoSlot,
    isSlotInsideLayout,
    moveItem,
    removeItem,
} from '@/lib/layout';
import LayoutSidebar from './LayoutSidebar';
import type { LayoutSpacing, LayoutType, NestedLayout } from '@/types/layout';
import { graphToTree } from '@/lib/layout';
import { MOCK_PAGE_GRAPH } from '@/app/mockData';

export default function DndBuilder() {
    const [layouts, setLayouts] = useState<NestedLayout[]>(() =>
        graphToTree(MOCK_PAGE_GRAPH),
    );
    const [activeSidebarType, setActiveSidebarType] =
        useState<LayoutType | null>(null);
    const [activeCanvasId, setActiveCanvasId] = useState<string | null>(null);
    const [insertIndex, setInsertIndex] = useState<number | null>(null);
    const [insertSlotId, setInsertSlotId] = useState<string | null>(null);
    const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(
        null,
    );

    const layoutsRef = useRef(layouts);
    layoutsRef.current = layouts;
    // 記錄拖曳開始時的來源容器，用來判斷是否跨容器
    const activeContainerRef = useRef<string | null>(null);
    // 記錄目前正在拖曳的 canvas item id（handleDragOver 是 stale closure，無法讀 state）
    const activeCanvasIdRef = useRef<string | null>(null);

    const dndId = useId();

    // 避免 SSR / client 不一致導致 hydration mismatch
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMobile(/iPhone|Android/i.test(navigator.userAgent));
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: isMobile
                ? { delay: 180, tolerance: 6 }
                : { distance: 6 },
        }),
    );

    // ── DragStart ─────────────────────────
    const handleDragStart = useCallback((event: DragStartEvent) => {
        const data = event.active.data.current;
        if (data?.source === 'sidebar') {
            setActiveSidebarType(data.type as LayoutType);
        } else {
            setActiveCanvasId(event.active.id as string);
            activeCanvasIdRef.current = event.active.id as string;
            activeContainerRef.current = findContainer(
                event.active.id as string,
                layoutsRef.current,
            );
        }
        setInsertIndex(null);
        setInsertSlotId(null);
    }, []);

    // ── DragOver：計算插入線位置 ─────────────────
    const handleDragOver = useCallback((event: DragOverEvent) => {
        const activeData = event.active.data.current;
        const isSidebar = activeData?.source === 'sidebar';

        const overData = event.over?.data.current;
        const translated = event.active.rect.current.translated;
        if (!translated) return;

        const activeMidY = translated.top + translated.height / 2;

        if (overData?.type === 'slot') {
            const slotId = event.over!.id as string;

            // 不允許拖進自己（或後代）的 slot
            if (
                !isSidebar &&
                activeCanvasIdRef.current &&
                isSlotInsideLayout(
                    slotId,
                    activeCanvasIdRef.current,
                    layoutsRef.current,
                )
            ) {
                setInsertSlotId(null);
                setInsertIndex(null);
                return;
            }

            const elements = Array.from(
                document.querySelectorAll(
                    `[data-slot-id="${slotId}"] [data-canvas-item]`,
                ),
            ) as HTMLElement[];

            let newIndex = elements.length;
            for (let i = 0; i < elements.length; i++) {
                const rect = elements[i].getBoundingClientRect();
                if (activeMidY < rect.top + rect.height / 2) {
                    newIndex = i;
                    break;
                }
            }

            setInsertSlotId(slotId);
            setInsertIndex(newIndex);
        } else if (overData?.type === 'canvas') {
            const elements = Array.from(
                document.querySelectorAll(
                    '[data-root-canvas] > [data-canvas-item]',
                ),
            ) as HTMLElement[];

            let newIndex = elements.length;
            for (let i = 0; i < elements.length; i++) {
                const rect = elements[i].getBoundingClientRect();
                if (activeMidY < rect.top + rect.height / 2) {
                    newIndex = i;
                    break;
                }
            }
            setInsertSlotId(null);
            setInsertIndex(prev => (prev === newIndex ? prev : newIndex));
        } else {
            setInsertSlotId(null);
            setInsertIndex(null);
        }
    }, []);

    // ── DragEnd ─────────────────────────
    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            const activeData = active.data.current;

            const currentInsertIndex = insertIndex;

            setActiveSidebarType(null);
            setActiveCanvasId(null);
            setInsertIndex(null);
            setInsertSlotId(null);

            activeContainerRef.current = null;
            activeCanvasIdRef.current = null;
            if (!over) return;

            // Sidebar → Canvas
            if (activeData?.source === 'sidebar') {
                const newLayout = createLayout(
                    activeData.type as LayoutType,
                    activeData.label as string,
                );
                const overData = over.data.current;

                if (overData?.type === 'slot') {
                    const slotId = over.id as string;
                    const ownerId = overData.ownerId as string;
                    setLayouts(prev =>
                        insertIntoSlot(
                            prev,
                            ownerId,
                            slotId,
                            newLayout,
                            currentInsertIndex ?? undefined,
                        ),
                    );
                } else if (overData?.type === 'canvas') {
                    setLayouts(prev => {
                        const next = [...prev];
                        next.splice(
                            currentInsertIndex ?? prev.length,
                            0,
                            newLayout,
                        );
                        return next;
                    });
                }
                return;
            }

            // Canvas 內排序 / 跨容器搬移
            const activeId = active.id as string;
            const overId = over.id as string;
            if (activeId === overId) return;

            setLayouts(prev => {
                const activeContainer = findContainer(activeId, prev);
                if (!activeContainer) return prev;

                // 決定目標容器
                const overData = over.data.current;
                let targetContainer: string;
                if (overData?.type === 'slot') {
                    targetContainer = over.id as string;
                } else if (overData?.type === 'canvas') {
                    targetContainer = 'root';
                } else {
                    // over 是另一個 layout item，找它所在的容器
                    targetContainer =
                        findContainer(overId, prev) ?? activeContainer;
                }

                // 同容器排序：transform 凍結後 overId 是 canvas/slot droppable，
                // 改用 currentInsertIndex 直接定位
                if (activeContainer === targetContainer) {
                    if (currentInsertIndex === null) return prev;
                    return moveItem(
                        prev,
                        activeId,
                        targetContainer,
                        currentInsertIndex,
                    );
                }

                // 跨容器搬移
                // 防止拖進自己（或後代）的 slot
                if (
                    targetContainer !== 'root' &&
                    isSlotInsideLayout(targetContainer, activeId, prev)
                ) {
                    return prev;
                }

                return moveItem(
                    prev,
                    activeId,
                    targetContainer,
                    currentInsertIndex ?? undefined,
                );
            });
        },
        [insertIndex, insertSlotId],
    );

    // ── DragCancel ─────────────────────────
    const handleDragCancel = useCallback(() => {
        setActiveSidebarType(null);
        setActiveCanvasId(null);
        setInsertIndex(null);
        setInsertSlotId(null);
        activeContainerRef.current = null;
        activeCanvasIdRef.current = null;
    }, []);

    const handleRemove = useCallback((id: string) => {
        setLayouts(prev => removeItem(prev, id));
        setSelectedLayoutId(prev => (prev === id ? null : prev));
    }, []);

    const handleSelect = useCallback((id: string) => {
        setSelectedLayoutId(prev => (prev === id ? null : id));
    }, []);

    // 遞迴找到目前選取的 layout
    const findLayout = (
        id: string,
        items: NestedLayout[],
    ): NestedLayout | null => {
        for (const l of items) {
            if (l.id === id) return l;
            for (const s of l.slots) {
                const found = findLayout(id, s.children);
                if (found) return found;
            }
        }
        return null;
    };
    const selectedLayout = selectedLayoutId
        ? findLayout(selectedLayoutId, layouts)
        : null;

    // 在指定 layout 新增一個空 slot
    const handleAddSlot = useCallback((layoutId: string) => {
        const addToLayout = (items: NestedLayout[]): NestedLayout[] =>
            items.map(l => {
                if (l.id === layoutId) {
                    const newSlots = [
                        ...l.slots,
                        { id: uuidv4(), children: [] },
                    ];
                    if (l.type === 'flex') {
                        // flex：重新均分所有 slot 的 flexBasis
                        return {
                            ...l,
                            slots: newSlots.map(s => ({
                                ...s,
                                flexBasis: 100 / newSlots.length,
                            })),
                        };
                    }
                    if (l.type === 'grid') {
                        // grid：重新計算需要幾列，同步擴充 gridRowHeights
                        const cols = l.gridColWidths?.length ?? 2;
                        const newRowCount = Math.ceil(newSlots.length / cols);
                        const existingRowHeights = l.gridRowHeights ?? [];
                        const newRowHeights = Array.from(
                            { length: newRowCount },
                            (_, i) => existingRowHeights[i] ?? 120,
                        );
                        return {
                            ...l,
                            slots: newSlots,
                            gridRowHeights: newRowHeights,
                        };
                    }
                    return { ...l, slots: newSlots };
                }
                return {
                    ...l,
                    slots: l.slots.map(s => ({
                        ...s,
                        children: addToLayout(s.children),
                    })),
                };
            });
        setLayouts(prev => addToLayout(prev));
    }, []);

    // 在指定 layout 移除指定 slot（有子項目時不允許）
    const handleRemoveSlot = useCallback((layoutId: string, slotId: string) => {
        const removeFromLayout = (items: NestedLayout[]): NestedLayout[] =>
            items.map(l => {
                if (l.id === layoutId) {
                    const remaining = l.slots.filter(s => s.id !== slotId);
                    if (l.type === 'flex' && remaining.length > 0) {
                        // flex：重新均分剩餘 slot 的 flexBasis
                        return {
                            ...l,
                            slots: remaining.map(s => ({
                                ...s,
                                flexBasis: 100 / remaining.length,
                            })),
                        };
                    }
                    if (l.type === 'grid') {
                        // grid：重新計算需要幾列，裁切或保留 gridRowHeights
                        const cols = l.gridColWidths?.length ?? 2;
                        const newRowCount = Math.max(
                            1,
                            Math.ceil(remaining.length / cols),
                        );
                        const existingRowHeights = l.gridRowHeights ?? [];
                        const newRowHeights = Array.from(
                            { length: newRowCount },
                            (_, i) => existingRowHeights[i] ?? 120,
                        );
                        return {
                            ...l,
                            slots: remaining,
                            gridRowHeights: newRowHeights,
                        };
                    }
                    return { ...l, slots: remaining };
                }
                return {
                    ...l,
                    slots: l.slots.map(s => ({
                        ...s,
                        children: removeFromLayout(s.children),
                    })),
                };
            });
        setLayouts(prev => removeFromLayout(prev));
    }, []);

    const handleUpdateSpacing = useCallback(
        (layoutId: string, spacing: LayoutSpacing) => {
            const update = (items: NestedLayout[]): NestedLayout[] =>
                items.map(l => {
                    if (l.id === layoutId) return { ...l, spacing };
                    return {
                        ...l,
                        slots: l.slots.map(s => ({
                            ...s,
                            children: update(s.children),
                        })),
                    };
                });
            setLayouts(prev => update(prev));
        },
        [],
    );

    const handleUpdateSlotWidths = useCallback(
        (layoutId: string, widths: number[]) => {
            const update = (items: NestedLayout[]): NestedLayout[] =>
                items.map(l => {
                    if (l.id === layoutId) {
                        return {
                            ...l,
                            slots: l.slots.map((s, i) => ({
                                ...s,
                                flexBasis: widths[i] ?? s.flexBasis,
                            })),
                        };
                    }
                    return {
                        ...l,
                        slots: l.slots.map(s => ({
                            ...s,
                            children: update(s.children),
                        })),
                    };
                });
            setLayouts(prev => update(prev));
        },
        [],
    );

    const handleUpdateGridDimensions = useCallback(
        (
            layoutId: string,
            colWidths: number[],
            rowHeights: number[],
            colGap?: number,
            rowGap?: number,
        ) => {
            const update = (items: NestedLayout[]): NestedLayout[] =>
                items.map(l => {
                    if (l.id === layoutId)
                        return {
                            ...l,
                            gridColWidths: colWidths,
                            gridRowHeights: rowHeights,
                            ...(colGap !== undefined
                                ? { gridColGap: colGap }
                                : {}),
                            ...(rowGap !== undefined
                                ? { gridRowGap: rowGap }
                                : {}),
                        };
                    return {
                        ...l,
                        slots: l.slots.map(s => ({
                            ...s,
                            children: update(s.children),
                        })),
                    };
                });
            setLayouts(prev => update(prev));
        },
        [],
    );

    const handleUpdateFlexGap = useCallback(
        (layoutId: string, flexGap: number) => {
            const update = (items: NestedLayout[]): NestedLayout[] =>
                items.map(l => {
                    if (l.id === layoutId) return { ...l, flexGap };
                    return {
                        ...l,
                        slots: l.slots.map(s => ({
                            ...s,
                            children: update(s.children),
                        })),
                    };
                });
            setLayouts(prev => update(prev));
        },
        [],
    );

    const handleUpdateFlexWrap = useCallback(
        (layoutId: string, flexWrap: boolean) => {
            const update = (items: NestedLayout[]): NestedLayout[] =>
                items.map(l => {
                    if (l.id === layoutId) return { ...l, flexWrap };
                    return {
                        ...l,
                        slots: l.slots.map(s => ({
                            ...s,
                            children: update(s.children),
                        })),
                    };
                });
            setLayouts(prev => update(prev));
        },
        [],
    );

    const handleUpdateFlexRowGap = useCallback(
        (layoutId: string, flexRowGap: number) => {
            const update = (items: NestedLayout[]): NestedLayout[] =>
                items.map(l => {
                    if (l.id === layoutId) return { ...l, flexRowGap };
                    return {
                        ...l,
                        slots: l.slots.map(s => ({
                            ...s,
                            children: update(s.children),
                        })),
                    };
                });
            setLayouts(prev => update(prev));
        },
        [],
    );

    const overlayLabel =
        activeSidebarType === 'block'
            ? '塊級 Layout'
            : activeSidebarType === 'flex'
              ? 'Flex Layout'
              : 'Grid Layout';

    const overlayColor =
        activeSidebarType === 'block'
            ? 'border-violet-400 bg-violet-100 text-violet-700'
            : activeSidebarType === 'flex'
              ? 'border-sky-400 bg-sky-100 text-sky-700'
              : 'border-emerald-400 bg-emerald-100 text-emerald-700';

    const activeCanvasLayout = activeCanvasId
        ? findLayoutById(activeCanvasId, layouts)
        : null;

    const canvasOverlayColor = activeCanvasLayout
        ? activeCanvasLayout.type === 'block'
            ? 'border-violet-400 bg-violet-100 text-violet-700'
            : activeCanvasLayout.type === 'flex'
              ? 'border-sky-400 bg-sky-100 text-sky-700'
              : 'border-emerald-400 bg-emerald-100 text-emerald-700'
        : '';

    return (
        <DndContext
            id={dndId}
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className='flex h-screen w-full overflow-hidden'>
                <LayoutSidebar
                    selectedLayout={selectedLayout}
                    onAddSlot={handleAddSlot}
                    onRemoveSlot={handleRemoveSlot}
                    onUpdateSpacing={handleUpdateSpacing}
                    onUpdateGridDimensions={handleUpdateGridDimensions}
                    onUpdateFlexGap={handleUpdateFlexGap}
                    onUpdateFlexRowGap={handleUpdateFlexRowGap}
                    onUpdateFlexWrap={handleUpdateFlexWrap}
                    onDeselect={() => setSelectedLayoutId(null)}
                />
                <CanvasArea
                    layouts={layouts}
                    onRemove={handleRemove}
                    onSelect={handleSelect}
                    selectedLayoutId={selectedLayoutId}
                    insertIndex={insertSlotId === null ? insertIndex : null}
                    insertSlotId={insertSlotId}
                    slotInsertIndex={insertSlotId !== null ? insertIndex : null}
                    isSomethingDragging={activeCanvasId !== null}
                    onUpdateSlotWidths={handleUpdateSlotWidths}
                    onUpdateGridDimensions={handleUpdateGridDimensions}
                />
            </div>

            <DragOverlay dropAnimation={null}>
                {activeSidebarType ? (
                    <div
                        className={`rounded-lg border-2 px-4 py-3 shadow-lg font-semibold text-sm ${overlayColor}`}
                    >
                        {overlayLabel}
                    </div>
                ) : activeCanvasLayout ? (
                    <div
                        className={`rounded-lg border-2 px-4 py-3 shadow-lg font-semibold text-sm opacity-80 ${canvasOverlayColor}`}
                    >
                        {activeCanvasLayout.label}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

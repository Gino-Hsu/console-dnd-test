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
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useLayoutEditor } from '@/hooks/useLayoutEditor';
import CanvasArea from './CanvasArea';
import {
    createLayout,
    findContainer,
    findLayoutById,
    insertIntoSlot,
    isSlotInsideLayout,
    MAX_DEPTH,
    moveItem,
    removeItem,
} from '@/lib/layout';
import LayoutSidebar from './LayoutSidebar';
import type { LayoutType } from '@/types/layout';

export default function DndBuilder() {
    const {
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
        deselectLayout,
    } = useLayoutEditor();

    const [activeSidebarType, setActiveSidebarType] =
        useState<LayoutType | null>(null);
    const [activeCanvasId, setActiveCanvasId] = useState<string | null>(null);
    const [insertIndex, setInsertIndex] = useState<number | null>(null);
    const [insertSlotId, setInsertSlotId] = useState<string | null>(null);

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
                layouts,
            );
        }
        setInsertIndex(null);
        setInsertSlotId(null);
    }, []);

    // ── DragOver：計算插入線位置 ─────────────────
    const handleDragOver = useCallback(
        (event: DragOverEvent) => {
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
                        layouts,
                    )
                ) {
                    setInsertSlotId(null);
                    setInsertIndex(null);
                    return;
                }

                // 不允許超過最大層數
                if (overData?.depth >= MAX_DEPTH) {
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
        },
        [layouts],
    );

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

    console.log('layouts', layouts);

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
                    onDeselect={deselectLayout}
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
                    onUpdateWrapSlotWidth={handleUpdateWrapSlotWidth}
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

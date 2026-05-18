'use client';

import {
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
    createModule,
    createLayout,
    findContainer,
    findNodeById,
    insertIntoSlot,
    isSlotInsideLayout,
    MAX_DEPTH,
    moveItem,
} from '@/lib/page';

import type {
    LayoutType,
    NestedLayout,
    SidebarItem,
    CanvasNode,
    ActiveSidebarItem,
} from '@/types/layout';
import type { ModuleId } from '@/lib/module-registry/module-ids';
import { isLayoutNode } from '@/types/layout';
import type { LoggedSetLayouts } from './useLayoutEditor';

type UseDndBuilderProps = {
    layouts: NestedLayout[];
    setLayouts: LoggedSetLayouts;
};

export function useDndBuilder({ layouts, setLayouts }: UseDndBuilderProps) {
    const [activeSidebarItem, setActiveSidebarItem] = useState<ActiveSidebarItem | null>(null);

    const [activeCanvasId, setActiveCanvasId] = useState<string | null>(null);

    const [insertIndex, setInsertIndex] = useState<number | null>(null);

    const [insertSlotId, setInsertSlotId] = useState<string | null>(null);

    const activeContainerRef = useRef<string | null>(null);

    const activeCanvasIdRef = useRef<string | null>(null);

    // ─────────────────────────────────────
    // mobile sensor
    // ─────────────────────────────────────

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMobile(/iPhone|Android/i.test(navigator.userAgent));
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: isMobile
                ? { delay: 180, tolerance: 6 }
                : { distance: 6 },
        }),
    );

    // ─────────────────────────────────────
    // drag start
    // ─────────────────────────────────────

    const handleDragStart = useCallback(
        (event: DragStartEvent) => {
            const data = event.active.data.current;

            if (data?.source === 'sidebar') {
                if (data.type === 'module') {
                    // 從 Sidebar 拖動 Module
                    setActiveSidebarItem({
                        type: 'module',
                        moduleId: data.moduleId as ModuleId,
                        label: data.label as string,
                    });
                } else {
                    // 從 Sidebar 拖動 Layout
                    setActiveSidebarItem({
                        type: 'layout',
                        layoutType: data.type as LayoutType,
                        label: data.label as string,
                    });
                }
                setActiveCanvasId(null);
            } else {
                // 從 Canvas 拖動
                const id = event.active.id as string;

                setActiveCanvasId(id);
                setActiveSidebarItem(null);

                activeCanvasIdRef.current = id;

                activeContainerRef.current = findContainer(id, layouts);
            }

            setInsertIndex(null);
            setInsertSlotId(null);
        },
        [layouts],
    );

    // ─────────────────────────────────────
    // drag over
    // ─────────────────────────────────────

    const handleDragOver = useCallback(
        (event: DragOverEvent) => {
            const activeData = event.active.data.current;

            const isSidebar = activeData?.source === 'sidebar';

            const overData = event.over?.data.current;

            const translated = event.active.rect.current.translated;

            if (!translated) return;

            const activeMidY = translated.top + translated.height / 2;

            // slot
            if (overData?.type === 'slot') {
                const slotId = event.over!.id as string;

                // prevent self nesting
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

                // max depth
                if ((overData?.depth ?? 0) >= MAX_DEPTH) {
                    const isDraggingLayout =
                        activeData?.source === 'sidebar'
                            ? activeData?.type !== 'module'
                            : isLayoutNode(
                                  findNodeById(
                                      activeCanvasIdRef.current ?? '',
                                      layouts,
                                  ) ?? ({} as never),
                              );

                    if (isDraggingLayout) {
                        setInsertSlotId(null);
                        setInsertIndex(null);

                        return;
                    }
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

                return;
            }

            // root canvas
            if (overData?.type === 'canvas') {
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

                return;
            }

            setInsertSlotId(null);
            setInsertIndex(null);
        },
        [layouts],
    );

    // ─────────────────────────────────────
    // drag end
    // ─────────────────────────────────────

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;

            const activeData = active.data.current;

            const currentInsertIndex = insertIndex;

            // reset
            setActiveSidebarItem(null);
            setActiveCanvasId(null);
            setInsertIndex(null);
            setInsertSlotId(null);

            activeContainerRef.current = null;
            activeCanvasIdRef.current = null;

            if (!over) return;

            // ─────────────────────────
            // sidebar -> canvas
            // ─────────────────────────

            if (activeData?.source === 'sidebar') {
                const overData = over.data.current;

                // module
                if (activeData.type === 'module') {
                    if (overData?.type === 'slot') {
                        const newModule = createModule(
                            activeData.moduleId as ModuleId,
                            activeData.label as string,
                        );

                        const slotId = over.id as string;

                        const ownerId = overData.ownerId as string;

                        setLayouts(
                            prev =>
                                insertIntoSlot(
                                    prev,
                                    ownerId,
                                    slotId,
                                    newModule,
                                    currentInsertIndex ?? undefined,
                                ),
                            'add-module',
                            `新增 ${activeData.label}`,
                            true,
                        );
                    }

                    return;
                }

                // layout
                const newLayout = createLayout(
                    activeData.type as LayoutType,
                    activeData.label as string,
                );

                if (overData?.type === 'slot') {
                    if ((overData?.depth ?? 0) >= MAX_DEPTH) {
                        return;
                    }

                    const slotId = over.id as string;

                    const ownerId = overData.ownerId as string;

                    setLayouts(
                        prev =>
                            insertIntoSlot(
                                prev,
                                ownerId,
                                slotId,
                                newLayout,
                                currentInsertIndex ?? undefined,
                            ),
                        'add-layout',
                        `新增 ${activeData.label}`,
                        true,
                        {
                            layout: newLayout,
                            slotId,
                            ownerId,
                            index: currentInsertIndex,
                        },
                    );

                    return;
                }

                if (overData?.type === 'canvas') {
                    setLayouts(
                        prev => {
                            const next = [...prev];
                            next.splice(
                                currentInsertIndex ?? prev.length,
                                0,
                                newLayout,
                            );
                            return next;
                        },
                        'add-layout',
                        `新增 ${activeData.label}`,
                        true,
                        {
                            layout: newLayout,
                            index: currentInsertIndex,
                        },
                    );

                    return;
                }

                return;
            }

            // ─────────────────────────
            // canvas move
            // ─────────────────────────

            const activeId = active.id as string;

            const overId = over.id as string;

            if (activeId === overId) return;

            setLayouts(
                prev => {
                    const activeContainer = findContainer(activeId, prev);

                    if (!activeContainer) return prev;

                    const overData = over.data.current;

                    let targetContainer: string;

                    if (overData?.type === 'slot') {
                        targetContainer = over.id as string;
                    } else if (overData?.type === 'canvas') {
                        targetContainer = 'root';
                    } else {
                        targetContainer =
                            findContainer(overId, prev) ?? activeContainer;
                    }

                    // same container
                    if (activeContainer === targetContainer) {
                        if (currentInsertIndex === null) {
                            return prev;
                        }

                        return moveItem(
                            prev,
                            activeId,
                            targetContainer,
                            currentInsertIndex,
                        );
                    }

                    // prevent self nesting
                    if (
                        targetContainer !== 'root' &&
                        isSlotInsideLayout(targetContainer, activeId, prev)
                    ) {
                        return prev;
                    }

                    // max depth
                    if (targetContainer !== 'root') {
                        const activeNode = findNodeById(activeId, prev);

                        if (
                            activeNode &&
                            isLayoutNode(activeNode) &&
                            (overData?.depth ?? 0) >= MAX_DEPTH
                        ) {
                            return prev;
                        }
                    }

                    return moveItem(
                        prev,
                        activeId,
                        targetContainer,
                        currentInsertIndex ?? undefined,
                    );
                },
                'move-layout',
                '移動項目',
                true,
                {
                    layoutId: activeId,
                    targetSlotId:
                        over.data.current?.type === 'slot'
                            ? (over.id as string)
                            : over.data.current?.type === 'canvas'
                              ? 'root'
                              : (findContainer(over.id as string, layouts) ??
                                'root'),
                    index: currentInsertIndex,
                },
            );
        },
        [insertIndex, setLayouts, layouts],
    );

    // ─────────────────────────────────────
    // drag cancel
    // ─────────────────────────────────────

    const handleDragCancel = useCallback(() => {
        setActiveSidebarItem(null);
        setActiveCanvasId(null);
        setInsertIndex(null);
        setInsertSlotId(null);
        activeContainerRef.current = null;
        activeCanvasIdRef.current = null;
    }, []);

    return {
        sensors,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleDragCancel,
        activeSidebarItem,
        activeCanvasId,
        insertIndex,
        insertSlotId,
    };
}

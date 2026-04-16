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
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useId, useState } from 'react';
import CanvasArea from './CanvasArea';
import LayoutSidebar from './LayoutSidebar';
import type { LayoutType, NestedLayout } from './types';
import { LAYOUT_CONFIG } from './types';

/* ── 工具函式 ─────────────────────────────────────── */

function genId() {
    return crypto.randomUUID();
}

/** 建立一個帶預設 slots 的 NestedLayout */
export function createLayout(type: LayoutType, label: string): NestedLayout {
    const config = LAYOUT_CONFIG[type];
    return {
        id: genId(),
        type,
        label,
        slots: config.slotLabels.map(slotLabel => ({
            id: genId(),
            label: slotLabel,
            children: [],
        })),
    };
}

/**
 * 遞迴找出某個 item 所在的容器
 * 回傳 'root' 或 slotId，找不到回傳 null
 */
export function findContainer(
    itemId: string,
    items: NestedLayout[],
): string | null {
    if (items.some(l => l.id === itemId)) return 'root';
    for (const layout of items) {
        if (!layout.slots) continue;
        for (const slot of layout.slots) {
            if (slot.children.some(c => c.id === itemId)) return slot.id;
            const found = findContainer(itemId, slot.children);
            if (found) return found;
        }
    }
    return null;
}

/** 遞迴在指定 slot 內插入一個 layout（可指定位置） */
export function insertIntoSlot(
    items: NestedLayout[],
    slotId: string,
    newLayout: NestedLayout,
    atIndex?: number,
): NestedLayout[] {
    return items.map(layout => {
        if (!layout.slots) return layout;
        const slotIdx = layout.slots.findIndex(s => s.id === slotId);
        if (slotIdx !== -1) {
            return {
                ...layout,
                slots: layout.slots.map((s, i) => {
                    if (i !== slotIdx) return s;
                    const next = [...s.children];
                    next.splice(atIndex ?? next.length, 0, newLayout);
                    return { ...s, children: next };
                }),
            };
        }
        return {
            ...layout,
            slots: layout.slots.map(slot => ({
                ...slot,
                children: insertIntoSlot(
                    slot.children,
                    slotId,
                    newLayout,
                    atIndex,
                ),
            })),
        };
    });
}

/** 遞迴在指定容器內對兩個 item 做排序 */
export function sortInContainer(
    items: NestedLayout[],
    containerId: string,
    activeId: string,
    overId: string,
): NestedLayout[] {
    if (containerId === 'root') {
        const oldIndex = items.findIndex(i => i.id === activeId);
        const newIndex = items.findIndex(i => i.id === overId);
        if (oldIndex === -1 || newIndex === -1) return items;
        return arrayMove(items, oldIndex, newIndex);
    }
    return items.map(layout => {
        if (!layout.slots) return layout;
        const slotIdx = layout.slots.findIndex(s => s.id === containerId);
        if (slotIdx !== -1) {
            return {
                ...layout,
                slots: layout.slots.map((s, i) => {
                    if (i !== slotIdx) return s;
                    const oldIndex = s.children.findIndex(
                        c => c.id === activeId,
                    );
                    const newIndex = s.children.findIndex(c => c.id === overId);
                    if (oldIndex === -1 || newIndex === -1) return s;
                    return {
                        ...s,
                        children: arrayMove(s.children, oldIndex, newIndex),
                    };
                }),
            };
        }
        return {
            ...layout,
            slots: layout.slots.map(slot => ({
                ...slot,
                children: sortInContainer(
                    slot.children,
                    containerId,
                    activeId,
                    overId,
                ),
            })),
        };
    });
}

/** 遞迴移除某個 item */
export function removeItem(items: NestedLayout[], id: string): NestedLayout[] {
    return items
        .filter(l => l.id !== id)
        .map(layout => ({
            ...layout,
            slots: layout.slots?.map(slot => ({
                ...slot,
                children: removeItem(slot.children, id),
            })),
        }));
}

export default function DndBuilder() {
    const [layouts, setLayouts] = useState<NestedLayout[]>([]);
    const [activeSidebarType, setActiveSidebarType] =
        useState<LayoutType | null>(null);
    // insertIndex：根層插入位置；insertSlotId：目前懸停的 slot（null 表示根層）
    const [insertIndex, setInsertIndex] = useState<number | null>(null);
    const [insertSlotId, setInsertSlotId] = useState<string | null>(null);

    const dndId = useId();

    const isMobile =
        typeof navigator !== 'undefined' &&
        /iPhone|Android/i.test(navigator.userAgent);

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
            setInsertIndex(null);
            setInsertSlotId(null);
        }
    }, []);

    // ── DragOver：計算插入線位置 ─────────────────
    const handleDragOver = useCallback((event: DragOverEvent) => {
        const activeData = event.active.data.current;
        if (activeData?.source !== 'sidebar') return;

        const overData = event.over?.data.current;
        const translated = event.active.rect.current.translated;
        if (!translated) return;

        const activeMidY = translated.top + translated.height / 2;

        console.log('DragOver:', overData);

        if (overData?.type === 'slot') {
            // 懸停在某個 slot 上
            const slotId = event.over!.id as string;
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

            console.log('newIndex:', newIndex);

            setInsertSlotId(slotId);
            setInsertIndex(newIndex);
        } else if (overData?.type === 'canvas') {
            // 懸停在根畫布
            const elements = Array.from(
                document.querySelectorAll(
                    '[data-root-canvas] > [data-canvas-item]',
                ),
            ) as HTMLElement[];

            console.log('activeMidY:', activeMidY, 'elements:', elements);

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
            setInsertIndex(null);
            setInsertSlotId(null);
            if (!over) return;

            // Sidebar → Canvas
            if (activeData?.source === 'sidebar') {
                const newLayout = createLayout(
                    activeData.type as LayoutType,
                    activeData.label as string,
                );
                const overData = over.data.current;

                if (overData?.type === 'slot') {
                    // 拖到某個 slot → 插入該 slot（依 insertIndex 位置）
                    setLayouts(prev =>
                        insertIntoSlot(
                            prev,
                            over.id as string,
                            newLayout,
                            currentInsertIndex ?? undefined,
                        ),
                    );
                } else if (overData?.type === 'canvas') {
                    // 拖到 root 畫布 → 插入指定位置
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

            // Canvas 內排序
            const activeId = active.id as string;
            const overId = over.id as string;
            if (activeId === overId) return;

            setLayouts(prev => {
                const activeContainer = findContainer(activeId, prev);
                const overContainer = findContainer(overId, prev);

                if (!activeContainer || !overContainer) return prev;

                if (activeContainer === overContainer) {
                    return sortInContainer(
                        prev,
                        activeContainer,
                        activeId,
                        overId,
                    );
                }

                return prev;
            });
        },
        [insertIndex, insertSlotId],
    );

    // ── DragCancel ─────────────────────────
    const handleDragCancel = useCallback(() => {
        setActiveSidebarType(null);
        setInsertIndex(null);
        setInsertSlotId(null);
    }, []);

    const handleRemove = useCallback((id: string) => {
        setLayouts(prev => removeItem(prev, id));
    }, []);

    const overlayLabel =
        activeSidebarType === 'block' ? '塊級 Layout' : 'Flex Layout';

    const overlayColor =
        activeSidebarType === 'block'
            ? 'border-violet-400 bg-violet-100 text-violet-700'
            : 'border-sky-400 bg-sky-100 text-sky-700';

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
                <LayoutSidebar />
                <CanvasArea
                    layouts={layouts}
                    onRemove={handleRemove}
                    insertIndex={insertSlotId === null ? insertIndex : null}
                    insertSlotId={insertSlotId}
                    slotInsertIndex={insertSlotId !== null ? insertIndex : null}
                />
            </div>

            <DragOverlay>
                {activeSidebarType ? (
                    <div
                        className={`rounded-lg border-2 px-4 py-3 shadow-lg font-semibold text-sm ${overlayColor}`}
                    >
                        {overlayLabel}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

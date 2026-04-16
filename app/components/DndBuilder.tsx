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
import type { LayoutType, PageDocument, PageVersion } from './types';

function genId() {
    return `canvas-item-${crypto.randomUUID()}`;
}

function createPageVersion(data: PageDocument[] = []): PageVersion {
    return {
        id: 'page-version-1',
        pageId: 'page-1',
        version: 1,
        status: 'draft',
        data,
        createdAt: new Date().toISOString(),
    };
}

export default function DndBuilder() {
    const [pageVersion, setPageVersion] =
        useState<PageVersion>(createPageVersion());

    const [activeSidebarType, setActiveSidebarType] =
        useState<LayoutType | null>(null);

    // ⭐ 改用 state，CanvasArea 才能即時拿到最新插入線位置
    const [insertIndex, setInsertIndex] = useState<number | null>(null);

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
        }
    }, []);

    // ── DragOver：用 active.rect 取得即時滑鼠位置 ─────────────────
    const handleDragOver = useCallback((event: DragOverEvent) => {
        const activeData = event.active.data.current;
        if (activeData?.source !== 'sidebar') return;

        const translated = event.active.rect.current.translated;
        if (!translated) return;

        const activeMidY = translated.top + translated.height / 2;

        const elements = Array.from(
            document.querySelectorAll('[data-canvas-item]'),
        ) as HTMLElement[];

        if (elements.length === 0) {
            setInsertIndex(0);
            return;
        }

        let newIndex = elements.length;

        for (let i = 0; i < elements.length; i++) {
            const rect = elements[i].getBoundingClientRect();
            const midY = rect.top + rect.height / 2;

            if (activeMidY < midY) {
                newIndex = i;
                break;
            }
        }

        // 只有真正改變才更新，避免不必要的 re-render
        setInsertIndex(prev => (prev === newIndex ? prev : newIndex));
    }, []);

    // ── DragEnd ─────────────────────────
    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            const activeData = active.data.current;

            // ⭐ 先讀 insertIndex，再清除
            const currentInsertIndex = insertIndex;
            setActiveSidebarType(null);
            setInsertIndex(null);

            // ⭐ Sidebar → Canvas
            if (activeData?.source === 'sidebar') {
                if (!over) return;

                const newDoc: PageDocument = {
                    id: genId(),
                    type: activeData.type as LayoutType,
                    label: activeData.label as string,
                };

                setPageVersion(prev => {
                    const next = [...prev.data];
                    const idx = currentInsertIndex ?? prev.data.length;
                    next.splice(idx, 0, newDoc);
                    return { ...prev, data: next };
                });

                return;
            }

            // ⭐ Canvas 排序
            if (!over || active.id === over.id) return;

            setPageVersion(prev => {
                const oldIndex = prev.data.findIndex(i => i.id === active.id);
                const newIndex = prev.data.findIndex(i => i.id === over.id);

                if (oldIndex === -1 || newIndex === -1) return prev;

                return {
                    ...prev,
                    data: arrayMove(prev.data, oldIndex, newIndex),
                };
            });
        },
        [insertIndex], // ← 依賴 insertIndex
    );

    // ── DragCancel ─────────────────────────
    const handleDragCancel = useCallback(() => {
        setActiveSidebarType(null);
        setInsertIndex(null);
    }, []);

    const handleRemove = useCallback((id: string) => {
        setPageVersion(prev => ({
            ...prev,
            data: prev.data.filter(i => i.id !== id),
        }));
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
                    items={pageVersion.data}
                    insertIndex={insertIndex}
                    onRemove={handleRemove}
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

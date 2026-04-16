'use client';

import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { InsertLine } from './CanvasArea';
import type { NestedLayout, Slot } from './types';

/* ── 單個 Slot 區域 ── */
function SlotZone({
    slot,
    onRemove,
    insertSlotId,
    slotInsertIndex,
}: {
    slot: Slot;
    onRemove: (id: string) => void;
    insertSlotId: string | null;
    slotInsertIndex: number | null;
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: slot.id,
        data: { type: 'slot', slotId: slot.id },
    });

    const isActiveSlot = insertSlotId === slot.id;

    return (
        <div className='flex-1 min-w-0' data-slot-id={slot.id}>
            <div className='text-xs font-medium text-zinc-400 mb-1 select-none'>
                {slot.label}
            </div>

            <SortableContext
                items={slot.children.map(c => c.id)}
                strategy={verticalListSortingStrategy}
            >
                <div
                    ref={setNodeRef}
                    className={`min-h-16 rounded-lg border-2 border-dashed p-4 flex flex-col gap-2 transition-colors ${
                        isOver
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-zinc-200 bg-white/60'
                    }`}
                >
                    {slot.children.length === 0 ? (
                        <>
                            {isActiveSlot && slotInsertIndex === 0 && (
                                <InsertLine />
                            )}
                            <div
                                className={`flex items-center justify-center h-10 text-xs select-none transition-colors ${
                                    isOver ? 'text-blue-400' : 'text-zinc-300'
                                }`}
                            >
                                拖曳 Layout 到此 slot
                            </div>
                        </>
                    ) : (
                        <>
                            {isActiveSlot && slotInsertIndex === 0 && (
                                <InsertLine />
                            )}
                            {slot.children.map((child, index) => (
                                <div key={child.id} data-canvas-item>
                                    <div className='py-1'>
                                        <LayoutCard
                                            layout={child}
                                            onRemove={onRemove}
                                            depth={1}
                                            insertSlotId={insertSlotId}
                                            slotInsertIndex={slotInsertIndex}
                                        />
                                    </div>
                                    {isActiveSlot &&
                                        slotInsertIndex === index + 1 && (
                                            <InsertLine />
                                        )}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}

/* ── 單一 Layout 卡片（遞迴） ── */
export default function LayoutCard({
    layout,
    onRemove,
    depth = 0,
    insertSlotId,
    slotInsertIndex,
}: {
    layout: NestedLayout;
    onRemove: (id: string) => void;
    depth?: number;
    insertSlotId: string | null;
    slotInsertIndex: number | null;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: layout.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const isBlock = layout.type === 'block';

    // 隨巢狀深度調暗邊框色
    const borderColor = isBlock
        ? depth === 0
            ? 'border-violet-300'
            : 'border-violet-200'
        : depth === 0
          ? 'border-sky-300'
          : 'border-sky-200';

    const bgColor = isBlock
        ? depth === 0
            ? 'bg-violet-50'
            : 'bg-violet-50/70'
        : depth === 0
          ? 'bg-sky-50'
          : 'bg-sky-50/70';

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative rounded-lg border-2 p-3 group transition-colors ${borderColor} ${bgColor}`}
        >
            {/* Header */}
            <div className='flex items-center gap-2 mb-3'>
                {/* 拖曳把手 */}
                <button
                    {...listeners}
                    {...attributes}
                    className='cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 shrink-0'
                    aria-label='拖曳排序'
                >
                    <svg
                        width='14'
                        height='14'
                        viewBox='0 0 14 14'
                        fill='currentColor'
                    >
                        <circle cx='4' cy='3' r='1.5' />
                        <circle cx='10' cy='3' r='1.5' />
                        <circle cx='4' cy='7' r='1.5' />
                        <circle cx='10' cy='7' r='1.5' />
                        <circle cx='4' cy='11' r='1.5' />
                        <circle cx='10' cy='11' r='1.5' />
                    </svg>
                </button>

                <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isBlock
                            ? 'bg-violet-200 text-violet-700'
                            : 'bg-sky-200 text-sky-700'
                    }`}
                >
                    {isBlock ? 'Block' : 'Flex'}
                </span>

                <span className='text-sm font-semibold text-zinc-700 flex-1 truncate'>
                    {layout.label}
                </span>

                {/* 刪除按鈕 */}
                <button
                    onClick={() => onRemove(layout.id)}
                    className='opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-500 rounded p-0.5 shrink-0'
                    aria-label='移除此 Layout'
                >
                    <svg
                        width='12'
                        height='12'
                        viewBox='0 0 14 14'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                    >
                        <path d='M2 2l10 10M12 2L2 12' />
                    </svg>
                </button>
            </div>

            {/* Slots */}
            {layout.slots && layout.slots.length > 0 && (
                <div
                    className={`flex gap-2 ${
                        isBlock ? 'flex-col' : 'flex-row'
                    }`}
                >
                    {layout.slots.map(slot => (
                        <SlotZone
                            key={slot.id}
                            slot={slot}
                            onRemove={onRemove}
                            insertSlotId={insertSlotId}
                            slotInsertIndex={slotInsertIndex}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

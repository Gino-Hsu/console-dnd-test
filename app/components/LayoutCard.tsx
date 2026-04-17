'use client';

import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { InsertLine } from './CanvasArea';
import type { NestedLayout } from './types';

/* ── 單個 Slot 區域 ── */
function SlotZone({
    slot,
    ownerId,
    onRemove,
    onSelect,
    selectedLayoutId,
    insertSlotId,
    slotInsertIndex,
}: {
    slot: {
        id: string;
        label?: string;
        children: import('./types').NestedLayout[];
    };
    ownerId: string;
    onRemove: (id: string) => void;
    onSelect: (id: string) => void;
    selectedLayoutId: string | null;
    insertSlotId: string | null;
    slotInsertIndex: number | null;
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: slot.id,
        data: { type: 'slot', ownerId, slotId: slot.id },
    });

    const isActiveSlot = insertSlotId === slot.id;

    return (
        <div className='flex-1 min-w-0' data-slot-id={slot.id}>
            {slot.label && (
                <div className='text-xs font-medium text-zinc-400 mb-1 select-none'>
                    {slot.label}
                </div>
            )}

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
                                            onSelect={onSelect}
                                            selectedLayoutId={selectedLayoutId}
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
    onSelect,
    selectedLayoutId,
    depth = 0,
    insertSlotId,
    slotInsertIndex,
}: {
    layout: NestedLayout;
    onRemove: (id: string) => void;
    onSelect: (id: string) => void;
    selectedLayoutId: string | null;
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
    const isFlex = layout.type === 'flex';
    const isGrid = layout.type === 'grid';

    // 隨巢狀深度調暗邊框色
    const borderColor = isBlock
        ? depth === 0
            ? 'border-violet-300'
            : 'border-violet-200'
        : isFlex
          ? depth === 0
              ? 'border-sky-300'
              : 'border-sky-200'
          : depth === 0
            ? 'border-emerald-300'
            : 'border-emerald-200';

    const bgColor = isBlock
        ? depth === 0
            ? 'bg-violet-50'
            : 'bg-violet-50/70'
        : isFlex
          ? depth === 0
              ? 'bg-sky-50'
              : 'bg-sky-50/70'
          : depth === 0
            ? 'bg-emerald-50'
            : 'bg-emerald-50/70';

    const isSelected = selectedLayoutId === layout.id;

    const sp = layout.spacing;
    const mt = sp?.margin.top ?? 0;
    const mr = sp?.margin.right ?? 0;
    const mb = sp?.margin.bottom ?? 0;
    const ml = sp?.margin.left ?? 0;
    const pt = sp?.padding.top ?? 0;
    const pr = sp?.padding.right ?? 0;
    const pb = sp?.padding.bottom ?? 0;
    const pl = sp?.padding.left ?? 0;
    const hasMargin = mt + mr + mb + ml > 0;
    const hasPadding = pt + pr + pb + pl > 0;

    return (
        <div
            style={{
                paddingTop: mt,
                paddingRight: mr,
                paddingBottom: mb,
                paddingLeft: ml,
            }}
            className={`rounded-xl transition-colors ${hasMargin ? 'bg-amber-100/60 outline-dashed outline-1 outline-amber-300' : ''}`}
        >
            <div
                ref={setNodeRef}
                style={style}
                className={`relative rounded-lg border-2 group transition-colors ${borderColor} ${bgColor} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
            >
                {hasPadding && (
                    <>
                        {pt > 0 && (
                            <div
                                className='absolute inset-x-0 top-0 bg-green-200/60 pointer-events-none z-10 rounded-t-lg'
                                style={{ height: pt }}
                            />
                        )}
                        {pb > 0 && (
                            <div
                                className='absolute inset-x-0 bottom-0 bg-green-200/60 pointer-events-none z-10 rounded-b-lg'
                                style={{ height: pb }}
                            />
                        )}
                        {pl > 0 && (
                            <div
                                className='absolute inset-y-0 left-0 bg-green-200/60 pointer-events-none z-10'
                                style={{ width: pl }}
                            />
                        )}
                        {pr > 0 && (
                            <div
                                className='absolute inset-y-0 right-0 bg-green-200/60 pointer-events-none z-10'
                                style={{ width: pr }}
                            />
                        )}
                    </>
                )}
                <div
                    style={{
                        paddingTop: Math.max(pt, 12),
                        paddingRight: Math.max(pr, 12),
                        paddingBottom: Math.max(pb, 12),
                        paddingLeft: Math.max(pl, 12),
                    }}
                >
                    <div
                        className='flex items-center gap-2 mb-3 cursor-pointer'
                        onClick={() => onSelect(layout.id)}
                    >
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
                                    : isFlex
                                      ? 'bg-sky-200 text-sky-700'
                                      : 'bg-emerald-200 text-emerald-700'
                            }`}
                        >
                            {isBlock ? 'Block' : isFlex ? 'Flex' : 'Grid'}
                        </span>
                        <span className='text-sm font-semibold text-zinc-700 flex-1 truncate'>
                            {layout.label}
                        </span>
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

                    {layout.slots.length > 0 && (
                        <div
                            className={
                                isBlock
                                    ? 'flex flex-col gap-2'
                                    : isFlex
                                      ? 'flex flex-row gap-2'
                                      : 'grid grid-cols-2 gap-2'
                            }
                        >
                            {layout.slots.map(slot => (
                                <SlotZone
                                    key={slot.id}
                                    slot={slot}
                                    ownerId={layout.id}
                                    onRemove={onRemove}
                                    onSelect={onSelect}
                                    selectedLayoutId={selectedLayoutId}
                                    insertSlotId={insertSlotId}
                                    slotInsertIndex={slotInsertIndex}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

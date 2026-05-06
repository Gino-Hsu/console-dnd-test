'use client';

import { useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cn } from '@/lib/cn';
import { InsertLine } from '../CanvasArea';
import type { CanvasNode, SlotAlign } from '@/types/layout';
import { isLayoutNode, ALIGN_CLASS } from '@/types/layout';
import type { SlotProps } from './types';
import { MAX_DEPTH } from '@/lib/layout';
import SlotEditor from './SlotEditor';
import LayoutCard from './LayoutCard';
import ComponentCard from '../component/ComponentCard';

export default function SlotZone({
    slot,
    flexBasis,
    isGridItem,
    isDragging,
    depth,
    ...sp
}: SlotProps & {
    slot: {
        id: string;
        label?: string;
        children: CanvasNode[];
        align?: SlotAlign;
    };
    flexBasis?: number;
    isGridItem?: boolean;
    isDragging?: boolean;
    depth: number;
}) {
    const atMaxDepth = depth + 1 >= MAX_DEPTH;
    const { setNodeRef, isOver } = useDroppable({
        id: slot.id,
        data: {
            type: 'slot',
            ownerId: sp.ownerId,
            slotId: slot.id,
            depth: depth + 1,
        },
        disabled: atMaxDepth,
    });
    const isActive = sp.insertSlotId === slot.id;
    const [editorOpen, setEditorOpen] = useState(false);
    const gearRef = useRef<HTMLButtonElement>(null);

    const alignClass = ALIGN_CLASS[slot.align ?? 'left'];

    return (
        <div
            className={cn(
                'relative group/slot',
                flexBasis !== undefined ? 'min-w-0' : 'flex-1 min-w-0',
                isGridItem ? 'h-full' : undefined,
            )}
            data-slot-id={slot.id}
        >
            {slot.label && (
                <div className='text-xs font-medium text-zinc-400 mb-1 select-none'>
                    {slot.label}
                </div>
            )}

            {/* gear button */}
            {sp.onUpdateSlotAlign && (
                <div className='absolute top-1 right-1 z-20 opacity-0 group-hover/slot:opacity-100 transition-opacity'>
                    <button
                        ref={gearRef}
                        className='w-5 h-5 flex items-center justify-center z-0'
                        onClick={e => {
                            e.stopPropagation();
                            setEditorOpen(o => !o);
                        }}
                        title='編輯 Slot 設定'
                    >
                        <svg
                            width='12'
                            height='12'
                            viewBox='0 0 16 16'
                            fill='none'
                        >
                            <path
                                d='M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'
                                stroke='currentColor'
                                strokeWidth='1.5'
                            />
                            <path
                                d='M13.3 9.3a1.2 1.2 0 0 0 .24 1.32l.04.04a1.45 1.45 0 0 1-2.05 2.05l-.04-.04a1.2 1.2 0 0 0-1.32-.24 1.2 1.2 0 0 0-.73 1.1V14a1.45 1.45 0 0 1-2.9 0v-.06a1.2 1.2 0 0 0-.78-1.1 1.2 1.2 0 0 0-1.32.24l-.04.04a1.45 1.45 0 0 1-2.05-2.05l.04-.04A1.2 1.2 0 0 0 2.7 9.7a1.2 1.2 0 0 0-1.1-.73H1.5a1.45 1.45 0 0 1 0-2.9h.06a1.2 1.2 0 0 0 1.1-.78 1.2 1.2 0 0 0-.24-1.32l-.04-.04A1.45 1.45 0 0 1 4.43 1.88l.04.04A1.2 1.2 0 0 0 5.79 2.16a1.2 1.2 0 0 0 .73-1.1V1a1.45 1.45 0 0 1 2.9 0v.06a1.2 1.2 0 0 0 .73 1.1 1.2 1.2 0 0 0 1.32-.24l.04-.04a1.45 1.45 0 0 1 2.05 2.05l-.04.04A1.2 1.2 0 0 0 13.28 5.3a1.2 1.2 0 0 0 1.1.73H14.5a1.45 1.45 0 0 1 0 2.9h-.06a1.2 1.2 0 0 0-1.1.73Z'
                                stroke='currentColor'
                                strokeWidth='1.5'
                            />
                        </svg>
                    </button>
                    {editorOpen && (
                        <SlotEditor
                            anchorRef={gearRef}
                            currentAlign={slot.align}
                            onUpdate={align =>
                                sp.onUpdateSlotAlign!(
                                    sp.ownerId,
                                    slot.id,
                                    align,
                                )
                            }
                            onClose={() => setEditorOpen(false)}
                        />
                    )}
                </div>
            )}

            <SortableContext
                items={slot.children.map(c => c.id)}
                strategy={verticalListSortingStrategy}
            >
                <div
                    ref={setNodeRef}
                    className={cn(
                        'rounded-lg border-2 border-dashed h-full p-4 flex flex-col gap-2 transition-colors',
                        alignClass,
                        isGridItem ? 'h-full' : 'min-h-16',
                        atMaxDepth
                            ? 'border-zinc-200 bg-zinc-50 opacity-60'
                            : isOver && !isDragging
                              ? 'border-blue-400 bg-blue-50'
                              : 'border-zinc-200 bg-white/60',
                    )}
                >
                    {slot.children.length === 0 ? (
                        <>
                            {isActive && sp.slotInsertIndex === 0 && (
                                <InsertLine />
                            )}
                            <div
                                className={`w-full flex items-center justify-center h-full text-xs transition-colors ${
                                    atMaxDepth
                                        ? 'text-zinc-300'
                                        : isOver
                                          ? 'text-blue-400'
                                          : 'text-zinc-300'
                                }`}
                            >
                                {atMaxDepth
                                    ? `已達最大層數（${MAX_DEPTH} 層）`
                                    : '拖曳 Layout 或 Component 到此處'}
                            </div>
                        </>
                    ) : (
                        <>
                            {isActive && sp.slotInsertIndex === 0 && (
                                <InsertLine />
                            )}
                            {slot.children.map((child, idx) => {
                                return (
                                    <div
                                        key={child.id}
                                        data-canvas-item
                                        className='w-full'
                                    >
                                        <div className='py-1'>
                                            {isLayoutNode(child) ? (
                                                <LayoutCard
                                                    layout={child}
                                                    depth={depth + 1}
                                                    isDraggingFromParent={
                                                        isDragging
                                                    }
                                                    {...sp}
                                                />
                                            ) : (
                                                <ComponentCard
                                                    component={child}
                                                    depth={depth + 1}
                                                    isDraggingFromParent={
                                                        isDragging
                                                    }
                                                    {...sp}
                                                />
                                            )}
                                        </div>
                                        {isActive &&
                                            sp.slotInsertIndex === idx + 1 && (
                                                <InsertLine />
                                            )}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}

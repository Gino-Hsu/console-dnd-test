'use client';

import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cn } from '@/lib/cn';
import { InsertLine } from '../CanvasArea';
import type { NestedLayout } from '@/types/layout';
import type { SlotProps } from './types';

// 延遲 import 避免循環依賴在模組初始化時出問題
// （實際執行時是安全的，因為 LayoutCard 在 render 時才被呼叫）
import LayoutCard from '../index';

export default function SlotZone({
    slot,
    flexBasis,
    isGridItem,
    isDragging,
    ...sp
}: SlotProps & {
    slot: { id: string; label?: string; children: NestedLayout[] };
    flexBasis?: number;
    isGridItem?: boolean;
    isDragging?: boolean;
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: slot.id,
        data: { type: 'slot', ownerId: sp.ownerId, slotId: slot.id },
    });
    const isActive = sp.insertSlotId === slot.id;

    return (
        <div
            className={cn(
                flexBasis !== undefined ? 'min-w-0' : 'flex-1 min-w-0',
                isGridItem ? 'h-full' : undefined,
            )}
            style={
                flexBasis !== undefined
                    ? { flexBasis: `${flexBasis}%`, flexShrink: 0, flexGrow: 0 }
                    : undefined
            }
            data-slot-id={slot.id}
        >
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
                    className={cn(
                        'rounded-lg border-2 border-dashed h-full p-4 flex flex-col gap-2 transition-colors',
                        isGridItem ? 'h-full' : 'min-h-16',
                        isOver && !isDragging
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
                                className={`flex items-center justify-center h-full text-xs select-none transition-colors ${isOver ? 'text-blue-400' : 'text-zinc-300'}`}
                            >
                                拖曳 Layout 到此 slot
                            </div>
                        </>
                    ) : (
                        <>
                            {isActive && sp.slotInsertIndex === 0 && (
                                <InsertLine />
                            )}
                            {slot.children.map((child, idx) => (
                                <div key={child.id} data-canvas-item>
                                    <div className='py-1'>
                                        <LayoutCard
                                            layout={child}
                                            depth={1}
                                            isDraggingFromParent={isDragging}
                                            {...sp}
                                        />
                                    </div>
                                    {isActive &&
                                        sp.slotInsertIndex === idx + 1 && (
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

'use client';

import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cn } from '@/lib/cn';
import { InsertLine } from '../CanvasArea';
import type { CanvasNode } from '@/types/layout';
import { isLayoutNode } from '@/types/layout';
import type { SlotProps } from './types';
import { MAX_DEPTH } from '@/lib/layout';

// 延遲 import 避免循環依賴在模組初始化時出問題
// （實際執行時是安全的，因為 LayoutCard 在 render 時才被呼叫）
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
    slot: { id: string; label?: string; children: CanvasNode[] };
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

    return (
        <div
            className={cn(
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

            <SortableContext
                items={slot.children.map(c => c.id)}
                strategy={verticalListSortingStrategy}
            >
                <div
                    ref={setNodeRef}
                    className={cn(
                        'rounded-lg border-2 border-dashed h-full p-4 flex flex-col gap-2 transition-colors',
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
                                className={`flex items-center justify-center h-full text-xs transition-colors ${
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
                                    <div key={child.id} data-canvas-item>
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

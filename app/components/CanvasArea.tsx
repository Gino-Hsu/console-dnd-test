'use client';

import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import LayoutCard from './LayoutCard';
import type { NestedLayout } from './types';

/*  插入線  */
export function InsertLine() {
    return (
        <div className='relative top-1 h-0 pointer-events-none overflow-visible'>
            <div className='absolute inset-x-0 -top-px h-0.5 bg-blue-500 rounded-full'>
                <div className='absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-blue-500' />
                <div className='absolute -right-1 -top-1.5 w-3 h-3 rounded-full bg-blue-500' />
            </div>
        </div>
    );
}

/*  畫布主元件  */
export default function CanvasArea({
    layouts,
    onRemove,
    insertIndex,
    insertSlotId,
    slotInsertIndex,
}: {
    layouts: NestedLayout[];
    onRemove: (id: string) => void;
    insertIndex: number | null;
    insertSlotId: string | null;
    slotInsertIndex: number | null;
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-root',
        data: { type: 'canvas' },
    });

    return (
        <main className='flex-1 flex flex-col h-full overflow-hidden'>
            <div className='px-6 py-4 border-b border-zinc-200 bg-white'>
                <h2 className='text-base font-bold text-zinc-800'>畫布</h2>
                <p className='text-xs text-zinc-500 mt-0.5'>
                    拖曳 Layout 到此畫布，或將 Layout 放入 Slot 中
                </p>
            </div>

            <div className='flex-1 overflow-y-auto p-6 bg-zinc-100'>
                <SortableContext
                    items={layouts.map(l => l.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div
                        ref={setNodeRef}
                        data-root-canvas
                        className={`min-h-full rounded-xl border-2 border-dashed p-3 flex flex-col gap-2 transition-colors ${
                            isOver
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-zinc-300 bg-zinc-100'
                        }`}
                    >
                        {layouts.length === 0 ? (
                            <div
                                className={`flex items-center justify-center h-64 rounded-xl transition-colors ${
                                    isOver ? 'text-blue-400' : 'text-zinc-400'
                                }`}
                            >
                                <div className='text-center'>
                                    <p className='text-lg mb-1'></p>
                                    <p className='text-sm font-medium'>
                                        拖曳 Layout 到此畫布，或將 Layout 放入
                                        Slot 中
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {insertIndex === 0 && <InsertLine />}
                                {layouts.map((layout, index) => (
                                    <div key={layout.id} data-canvas-item>
                                        <LayoutCard
                                            layout={layout}
                                            onRemove={onRemove}
                                            depth={0}
                                            insertSlotId={insertSlotId}
                                            slotInsertIndex={slotInsertIndex}
                                        />
                                        {insertIndex === index + 1 && (
                                            <InsertLine />
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </SortableContext>
            </div>
        </main>
    );
}

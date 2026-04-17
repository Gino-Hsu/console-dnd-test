'use client';

import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useCallback } from 'react';
import LayoutCard from './LayoutCard';
import type { NestedLayout, PageVersion } from './types';

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
    onSelect,
    selectedLayoutId,
    insertIndex,
    insertSlotId,
    slotInsertIndex,
}: {
    layouts: NestedLayout[];
    onRemove: (id: string) => void;
    onSelect: (id: string) => void;
    selectedLayoutId: string | null;
    insertIndex: number | null;
    insertSlotId: string | null;
    slotInsertIndex: number | null;
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-root',
        data: { type: 'canvas' },
    });

    const handlePublish = useCallback(() => {
        const pageVersion: PageVersion = {
            pageId: 'page-1',
            version: 1,
            status: 'published',
            data: layouts,
            createdAt: new Date().toISOString(),
        };
        console.log('📦 PageVersion:', pageVersion);
    }, [layouts]);

    return (
        <main className='flex-1 flex flex-col h-full overflow-hidden'>
            <div className='flex justify-between px-6 py-4 border-b border-zinc-200 bg-white'>
                <div>
                    <h2 className='text-base font-bold text-zinc-800'>畫布</h2>
                    <p className='text-xs text-zinc-500 mt-0.5'>
                        拖曳 Layout 到此畫布，或將 Layout 放入 Slot 中
                    </p>
                </div>
                <button
                    onClick={handlePublish}
                    className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold transition-colors shadow-sm'
                >
                    <svg
                        width='14'
                        height='14'
                        viewBox='0 0 14 14'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    >
                        <path d='M7 1v8M4 6l3 3 3-3' />
                        <path d='M1 10v1a2 2 0 002 2h8a2 2 0 002-2v-1' />
                    </svg>
                    發布
                </button>
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
                                            onSelect={onSelect}
                                            selectedLayoutId={selectedLayoutId}
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

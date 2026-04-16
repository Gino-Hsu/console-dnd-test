'use client';

import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { PageDocument } from './types';
import { it } from 'node:test';

/* ── 單一畫布元素 ── */
function CanvasCard({
    item,
    onRemove,
    layoutId,
}: {
    item: PageDocument;
    onRemove: (id: string) => void;
    layoutId: string;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const isBlock = item.type === 'block';

    // 佔位框：側邊欄拖入時的插入預覽
    if (item.isPlaceholder) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`rounded-lg border-2 border-dashed p-4 ${
                    isBlock
                        ? 'border-violet-400 bg-violet-50/60'
                        : 'border-sky-400 bg-sky-50/60'
                }`}
            >
                <div className='ml-6 opacity-40 pointer-events-none'>
                    <div className='flex items-center gap-2 mb-2'>
                        <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                isBlock
                                    ? 'bg-violet-200 text-violet-700'
                                    : 'bg-sky-200 text-sky-700'
                            }`}
                        >
                            {isBlock ? 'Block' : 'Flex'}
                        </span>
                        <span className='text-sm font-semibold text-zinc-700'>
                            {item.label}
                        </span>
                    </div>
                    {isBlock ? (
                        <div className='flex flex-col gap-1.5'>
                            {['元素 A', '元素 B', '元素 C'].map(t => (
                                <div
                                    key={t}
                                    className='w-full h-6 rounded bg-violet-200 flex items-center px-2 text-xs text-violet-700'
                                >
                                    {t}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='flex gap-1.5 flex-wrap'>
                            {['Item 1', 'Item 2', 'Item 3'].map(t => (
                                <div
                                    key={t}
                                    className='h-6 px-3 rounded bg-sky-200 flex items-center text-xs text-sky-700'
                                >
                                    {t}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative rounded-lg border-2 p-4 group transition-colors ${
                isBlock
                    ? 'border-violet-300 bg-violet-50'
                    : 'border-sky-300 bg-sky-50'
            }`}
            data-layout-id={layoutId}
            data-canvas-item
        >
            {/* 拖曳把手 */}
            <button
                {...listeners}
                {...attributes}
                className='absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 p-1'
                aria-label='拖曳重新排序'
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

            <div className='ml-6'>
                <div className='flex items-center gap-2 mb-2'>
                    <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            isBlock
                                ? 'bg-violet-200 text-violet-700'
                                : 'bg-sky-200 text-sky-700'
                        }`}
                    >
                        {isBlock ? 'Block' : 'Flex'}
                    </span>
                    <span className='text-sm font-semibold text-zinc-700'>
                        {item.label}
                    </span>
                </div>

                {/* Layout 示意圖 */}
                {isBlock ? (
                    <div className='flex flex-col gap-1.5'>
                        {['元素 A', '元素 B', '元素 C'].map(t => (
                            <div
                                key={t}
                                className='w-full h-6 rounded bg-violet-200 flex items-center px-2 text-xs text-violet-700'
                            >
                                {t}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='flex gap-1.5 flex-wrap'>
                        {['Item 1', 'Item 2', 'Item 3'].map(t => (
                            <div
                                key={t}
                                className='h-6 px-3 rounded bg-sky-200 flex items-center text-xs text-sky-700'
                            >
                                {t}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 刪除按鈕 */}
            <button
                onClick={() => onRemove(item.id)}
                className='absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-500 rounded p-0.5'
                aria-label='移除此 Layout'
            >
                <svg
                    width='14'
                    height='14'
                    viewBox='0 0 14 14'
                    fill='currentColor'
                >
                    <path
                        d='M2 2l10 10M12 2L2 12'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                    />
                </svg>
            </button>
        </div>
    );
}

/* ── 插入線 ── */
function InsertLine() {
    return (
        <div className='relative h-0 pointer-events-none'>
            <div className='absolute inset-x-0 -top-px h-0.5 bg-blue-500 rounded-full'>
                <div className='absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-blue-500' />
                <div className='absolute -right-1 -top-1.5 w-3 h-3 rounded-full bg-blue-500' />
            </div>
        </div>
    );
}

/* ── 畫布主體 ── */
export default function CanvasArea({
    items,
    insertIndex,
    onRemove,
}: {
    items: PageDocument[];
    insertIndex: number | null;
    onRemove: (id: string) => void;
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-drop-zone',
        data: { type: 'canvas' },
    });

    // 過濾掉 placeholder 後的真實 item 數量（決定是否顯示空畫布提示）
    const realItems = items.filter(i => !i.isPlaceholder);

    return (
        <main className='flex-1 flex flex-col h-full overflow-hidden'>
            <div className='px-6 py-4 border-b border-zinc-200 bg-white'>
                <h2 className='text-base font-bold text-zinc-800'>畫布</h2>
                <p className='text-xs text-zinc-500 mt-0.5'>
                    從左側拖曳 Layout 放置到此區域，可在區域內拖曳排序
                </p>
            </div>

            <div className={'flex-1 overflow-y-auto p-6 bg-zinc-100'}>
                <div
                    ref={setNodeRef}
                    className={`h-full transition-colors ${
                        isOver ? 'bg-blue-50' : 'bg-zinc-100'
                    }`}
                >
                    <SortableContext
                        items={items.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.length === 0 ? (
                            <div
                                className={`flex items-center justify-center h-full rounded-xl border-2 border-dashed transition-colors ${
                                    isOver
                                        ? 'border-blue-400 bg-blue-50 text-blue-500'
                                        : 'border-zinc-300 text-zinc-400'
                                }`}
                            >
                                <div className='text-center'>
                                    <p className='text-lg mb-1'>🖱️</p>
                                    <p className='text-sm font-medium'>
                                        拖曳 Layout 到此處
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className='p-3 overflow-y-auto flex flex-col gap-3 min-h-full rounded-xl border-2 border-dashed border-zinc-300'>
                                {/* 插入線在第 0 個位置（最頂端） */}
                                {insertIndex === 0 && <InsertLine />}

                                {items.map((item, index) => (
                                    <div key={item.id}>
                                        <CanvasCard
                                            item={item}
                                            onRemove={onRemove}
                                            layoutId={item.id}
                                        />
                                        {/* 插入線在第 index+1 個位置（每個 item 下方） */}
                                        {insertIndex === index + 1 && (
                                            <InsertLine />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </SortableContext>
                </div>
            </div>
        </main>
    );
}

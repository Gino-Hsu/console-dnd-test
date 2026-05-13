'use client';

import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { NestedLayout } from '@/types/layout';

export default function LayoutHeader({
    layout,
    listeners,
    attributes,
    onRemove,
    onSelect,
}: {
    layout: Pick<NestedLayout, 'id' | 'layoutType' | 'label'>;
    listeners: SyntheticListenerMap | undefined;
    attributes: DraggableAttributes;
    onRemove: (id: string) => void;
    onSelect: (id: string) => void;
}) {
    const nameMap = {
        block: 'Block',
        flex: 'Flex',
        grid: 'Grid',
    };

    const styleMap = {
        block: 'bg-violet-200 text-violet-700',
        flex: 'bg-sky-200 text-sky-700',
        grid: 'bg-emerald-200 text-emerald-700',
    };

    return (
        <div className='flex items-center gap-2 mb-3'>
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
                    styleMap[layout.layoutType]
                }`}
            >
                {nameMap[layout.layoutType]}
            </span>

            <span className='text-sm font-semibold text-zinc-700 flex-1 truncate'>
                {layout.label}
            </span>

            <button
                onClick={e => {
                    e.stopPropagation();
                    onSelect(layout.id);
                }}
                className='opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-sky-500 rounded p-0.5 shrink-0'
                aria-label='編輯 Layout 設定'
            >
                <svg width='12' height='12' viewBox='0 0 16 16' fill='none'>
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

            <button
                onClick={e => {
                    e.stopPropagation();
                    onRemove(layout.id);
                }}
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
    );
}

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
    layout: Pick<NestedLayout, 'id' | 'type' | 'label'>;
    listeners: SyntheticListenerMap | undefined;
    attributes: DraggableAttributes;
    onRemove: (id: string) => void;
    onSelect: (id: string) => void;
}) {
    const isBlock = layout.type === 'block';
    const isFlex = layout.type === 'flex';

    return (
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

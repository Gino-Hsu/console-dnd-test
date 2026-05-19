'use client';

import { useDraggable } from '@dnd-kit/core';
import type { SidebarItem } from '../types';
import { SIDEBAR_ITEMS } from '../types';

function DraggableSidebarItem({ item }: { item: SidebarItem }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidebar-${item.type}`,
        data: {
            type: item.type,
            label: item.label,
            source: 'sidebar',
        },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            className='flex flex-col gap-1 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm select-none hover:border-blue-400 hover:shadow-md transition-all'
        >
            <div className='flex items-center gap-2'>
                <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold ${item.className}`}
                >
                    {item.icon}
                </span>
                <span className='font-semibold text-sm text-zinc-800'>
                    {item.label}
                </span>
            </div>
            <p className='text-xs text-zinc-500 leading-snug'>
                {item.description}
            </p>
        </div>
    );
}

export default function LayoutSidebar() {
    return (
        <>
            <div className='px-4 py-4 border-b border-zinc-200'>
                <h2 className='text-base font-bold text-zinc-800'>
                    Layout 選單
                </h2>
                <p className='text-xs text-zinc-500 mt-0.5'>
                    拖曳元素到右側畫布以新增 Layout
                </p>
            </div>
            <div className='flex flex-col gap-3 p-4 overflow-y-auto overflow-x-hidden'>
                {SIDEBAR_ITEMS.map(item => (
                    <DraggableSidebarItem key={item.type} item={item} />
                ))}
            </div>
        </>
    );
}

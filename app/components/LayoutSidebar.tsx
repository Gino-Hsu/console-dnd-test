'use client';

import { useDraggable } from '@dnd-kit/core';
import type { LayoutSpacing, NestedLayout, SidebarItem } from './types';
import { SIDEBAR_ITEMS } from './types';
import LayoutEditor from './LayoutEditor';

function DraggableSidebarItem({ item }: { item: SidebarItem }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidebar-${item.type}`,
        data: { type: item.type, label: item.label, source: 'sidebar' },
    });

    const style: React.CSSProperties = {
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className='flex flex-col gap-1 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm select-none hover:border-blue-400 hover:shadow-md transition-all'
        >
            <div className='flex items-center gap-2'>
                {item.type === 'block' ? (
                    <span className='inline-flex items-center justify-center w-7 h-7 rounded bg-violet-100 text-violet-600 text-xs font-bold'>
                        B
                    </span>
                ) : item.type === 'flex' ? (
                    <span className='inline-flex items-center justify-center w-7 h-7 rounded bg-sky-100 text-sky-600 text-xs font-bold'>
                        F
                    </span>
                ) : (
                    <span className='inline-flex items-center justify-center w-7 h-7 rounded bg-emerald-100 text-emerald-600 text-xs font-bold'>
                        G
                    </span>
                )}
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

export default function LayoutSidebar({
    selectedLayout,
    onAddSlot,
    onRemoveSlot,
    onUpdateSpacing,
    onUpdateGridDimensions,
    onUpdateFlexGap,
    onDeselect,
}: {
    selectedLayout: NestedLayout | null;
    onAddSlot: (layoutId: string) => void;
    onRemoveSlot: (layoutId: string, slotId: string) => void;
    onUpdateSpacing: (layoutId: string, spacing: LayoutSpacing) => void;
    onUpdateGridDimensions?: (
        layoutId: string,
        colWidths: number[],
        rowHeights: number[],
        colGap?: number,
        rowGap?: number,
    ) => void;
    onUpdateFlexGap?: (layoutId: string, flexGap: number) => void;
    onDeselect: () => void;
}) {
    return (
        <aside className='w-64 shrink-0 border-r border-zinc-200 bg-zinc-50 flex flex-col h-full overflow-x-hidden'>
            {selectedLayout ? (
                <LayoutEditor
                    layout={selectedLayout}
                    onAddSlot={onAddSlot}
                    onRemoveSlot={onRemoveSlot}
                    onUpdateSpacing={onUpdateSpacing}
                    onUpdateGridDimensions={onUpdateGridDimensions}
                    onUpdateFlexGap={onUpdateFlexGap}
                    onDeselect={onDeselect}
                />
            ) : (
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
            )}
        </aside>
    );
}

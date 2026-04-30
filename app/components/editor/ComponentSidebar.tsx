'use client';

import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { getCategories, getModulesByCategory } from '@/lib/component-registry/helpers';
import type { ModuleConfig } from '@/types/component-registry';

function DraggableComponent({
    component,
}: {
    component: ModuleConfig;
}) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidebar-component-${component.componentId}`,
        data: {
            type: 'component',
            componentId: component.componentId,
            label: component.label,
            source: 'sidebar',
        },
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
                <span className='text-2xl'>{component.icon}</span>
                <span className='font-semibold text-sm text-zinc-800'>
                    {component.label}
                </span>
            </div>
            <p className='text-xs text-zinc-500 leading-snug'>
                {component.tags?.join('、') ?? ''}
            </p>
        </div>
    );
}

function CategoryAccordion({
    categoryInfo,
    components,
    isOpen,
    onToggle,
}: {
    categoryInfo: { id: string; name: string; icon: string };
    components: ModuleConfig[];
    isOpen: boolean;
    onToggle: () => void;
}) {

    return (
        <div className='overflow-hidden bg-white'>
            {/* Category Header */}
            <button
                onClick={onToggle}
                className='w-full flex items-center justify-between hover:bg-zinc-50 transition-colors'
            >
                <div className='flex items-center gap-2'>
                    <span className='text-lg'>{categoryInfo.icon}</span>
                    <span className='font-semibold text-sm text-zinc-800'>
                        {categoryInfo.name}
                    </span>
                    <span className='text-xs text-zinc-500'>
                        ({components.length})
                    </span>
                </div>
                <svg
                    width='16'
                    height='16'
                    viewBox='0 0 16 16'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    className={`transition-transform text-zinc-600 ${isOpen ? 'rotate-90' : ''}`}
                >
                    <path d='M6 4l4 4-4 4' />
                </svg>
            </button>

            {/* Category Content */}
            {isOpen && (
                <div className='flex flex-col gap-2 border-t border-zinc-100'>
                    {components.map(item => (
                        <DraggableComponent key={item.componentId} component={item} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ComponentSidebar() {
    // 使用 helpers 获取所有 categories
    const allCategories = getCategories();
    
    // 只包含有组件的 categories
    const categoriesWithComponents = allCategories.filter(
        cat => getModulesByCategory(cat.id).length > 0
    );

    // 管理每个 category 的展开状态（默认全部展开）
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
        categoriesWithComponents.reduce((acc, cat) => {
            acc[cat.id] = true;
            return acc;
        }, {} as Record<string, boolean>)
    );

    const toggleCategory = (categoryId: string) => {
        setOpenCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    return (
        <>
            <div className='px-4 py-4 border-b border-zinc-200'>
                <h2 className='text-base font-bold text-zinc-800'>
                    Component 選單
                </h2>
                <p className='text-xs text-zinc-500 mt-0.5'>
                    拖曳元件到 Layout 的 Slot 中
                </p>
            </div>
            <div className='flex flex-col gap-3 p-4 overflow-y-auto overflow-x-hidden'>
                {categoriesWithComponents.map(cat => {
                    const components = getModulesByCategory(cat.id);
                    return (
                        <CategoryAccordion
                            key={cat.id}
                            categoryInfo={cat}
                            components={components}
                            isOpen={openCategories[cat.id] ?? false}
                            onToggle={() => toggleCategory(cat.id)}
                        />
                    );
                })}
            </div>
        </>
    );
}

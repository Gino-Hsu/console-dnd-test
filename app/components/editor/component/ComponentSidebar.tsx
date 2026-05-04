'use client';

import { useState, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { getCategories, getComponentsByCategory } from '@/lib/component-registry/helpers';
import type { ComponentConfig } from '@/types/component-registry';
import { Accordion } from '../common/Accordion';

function DraggableComponent({
    component,
}: {
    component: ComponentConfig;
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

export default function ComponentSidebar() {
    // 取得所有 categories
    const allCategories = getCategories();
    
    // 只包含有元件的 categories
    const categoriesWithComponents = allCategories.filter(
        cat => getComponentsByCategory(cat.id).length > 0
    );

    // 管理每個 category 的展開狀態（預設全部展開）
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
        categoriesWithComponents.reduce((acc, cat) => {
            acc[cat.id] = true;
            return acc;
        }, {} as Record<string, boolean>)
    );

    // 判斷當前是否全部展開
    const allExpanded = useMemo(() => {
        return categoriesWithComponents.every(cat => openCategories[cat.id]);
    }, [openCategories, categoriesWithComponents]);

    const toggleCategory = (categoryId: string) => {
        setOpenCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    // 切換全部類別
    const toggleAll = () => {
        const newState = !allExpanded;
        setOpenCategories(
            categoriesWithComponents.reduce((acc, cat) => {
                acc[cat.id] = newState;
                return acc;
            }, {} as Record<string, boolean>)
        );
    };

    return (
        <>
            <div className='px-4 py-4 border-b border-zinc-200'>
                <div className='flex items-center justify-between mb-1'>
                    <h2 className='text-base font-bold text-zinc-800'>
                        Component 選單
                    </h2>
                    <button
                        onClick={toggleAll}
                        className='text-xs text-blue-600 cursor-pointer hover:text-blue-700 transition-colors'
                        title={allExpanded ? '全部收合' : '全部展開'}
                    >
                        {allExpanded ? '全部收合' : '全部展開'}
                    </button>
                </div>
                <p className='text-xs text-zinc-500 mt-0.5'>
                    拖曳元件到 Layout 的 Slot 中
                </p>
            </div>
            <div className='flex flex-col gap-3 p-4 overflow-y-auto overflow-x-hidden'>
                {categoriesWithComponents.map(cat => {
                    const components = getComponentsByCategory(cat.id);
                    return (
                        <Accordion
                            key={cat.id}
                            header={
                                <>
                                    <span className='text-lg'>{cat.icon}</span>
                                    <span className='font-semibold text-sm text-zinc-800'>
                                        {cat.name}
                                    </span>
                                    <span className='text-xs text-zinc-500'>
                                        ({components.length})
                                    </span>
                                </>
                            }
                            open={openCategories[cat.id] ?? false}
                            onToggle={() => toggleCategory(cat.id)}
                        >
                            {components.map(item => (
                                <DraggableComponent key={item.componentId} component={item} />
                            ))}
                        </Accordion>
                    );
                })}
            </div>
        </>
    );
}

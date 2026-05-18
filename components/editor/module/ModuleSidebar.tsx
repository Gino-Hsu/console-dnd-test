'use client';

import { useState, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { getCategories, getModulesByCategory } from '@/lib/module-registry/helpers';
import type { ModuleConfig } from '@/types/module-registry';
import { Accordion } from '../common/Accordion';

function DraggableModule({
    module,
}: {
    module: ModuleConfig;
}) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidebar-module-${module.moduleId}`,
        data: {
            type: 'module',
            moduleId: module.moduleId,
            label: module.label,
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
                <span className='text-2xl'>{module.icon}</span>
                <span className='font-semibold text-sm text-zinc-800'>
                    {module.label}
                </span>
            </div>
            <p className='text-xs text-zinc-500 leading-snug'>
                {module.tags?.join('、') ?? ''}
            </p>
        </div>
    );
}

export default function ModuleSidebar() {
    // 取得所有 categories
    const allCategories = getCategories();
    
    // 只包含有模組的 categories
    const categoriesWithModules = allCategories.filter(
        cat => getModulesByCategory(cat.id).length > 0
    );

    // 管理每個 category 的展開狀態（預設全部展開）
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
        categoriesWithModules.reduce((acc, cat) => {
            acc[cat.id] = true;
            return acc;
        }, {} as Record<string, boolean>)
    );

    // 判斷當前是否全部展開
    const allExpanded = useMemo(() => {
        return categoriesWithModules.every(cat => openCategories[cat.id]);
    }, [openCategories, categoriesWithModules]);

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
            categoriesWithModules.reduce((acc, cat) => {
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
                        Module 選單
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
                    拖曳模組到 Layout 的 Slot 中
                </p>
            </div>
            <div className='flex flex-col gap-3 p-4 overflow-y-auto overflow-x-hidden'>
                {categoriesWithModules.map(cat => {
                    const modules = getModulesByCategory(cat.id);
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
                                        ({modules.length})
                                    </span>
                                </>
                            }
                            open={openCategories[cat.id] ?? false}
                            onToggle={() => toggleCategory(cat.id)}
                        >
                            {modules.map(item => (
                                <DraggableModule key={item.moduleId} module={item} />
                            ))}
                        </Accordion>
                    );
                })}
            </div>
        </>
    );
}

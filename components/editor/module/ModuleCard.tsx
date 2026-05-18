'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ModuleNode } from '@/types/layout';
import type { SharedProps } from '../layout/types';
import { cn } from '@/lib/cn';
import { getModuleConfig } from '@/lib/module-registry';
import { getCategoryTheme } from '@/lib/theme';

export default function ModuleCard({
    module,
    isDraggingFromParent = false,
    ...shared
}: SharedProps & {
    module: ModuleNode;
    depth?: number;
    isDraggingFromParent?: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: module.id });

    // 凍結 sortable dodge transform（與 LayoutCard 相同邏輯）
    const sortStyle: React.CSSProperties = {
        transform: shared.isSomethingDragging
            ? undefined
            : CSS.Transform.toString(transform),
        transition: shared.isSomethingDragging ? undefined : transition,
        opacity: isDragging ? 0.4 : 1,
    };

    // 從 registry 獲取完整配置
    const config = getModuleConfig(module.moduleId);
    
    if (!config) {
        return (
            <div className="text-red-500 p-2 border border-red-300 rounded">
                Unknown module: {module.moduleId}
            </div>
        );
    }

    const { icon, label, category, module: Module } = config;
    
    // 根據 category 獲取主題配色
    const theme = getCategoryTheme(category);
    const isSelected = shared.selectedLayoutId === module.id;

    // 計算模組外層寬度
    // TODO: 目前先補上 padding (2層p-3為48px) 和 border (6px)，實際數值待調整
    const innerWidth = module.style.width || '100%';
    const outerWidth = innerWidth === '100%' || innerWidth === 'auto'
        ? innerWidth
        : `calc(${innerWidth} + 48px + 6px)`;

    return (
        <div data-canvas-item style={{
            width: outerWidth
        }}>
            <div
                ref={setNodeRef}
                style={sortStyle}
                className={cn(
                    'rounded-lg border-2 p-3 transition-all',
                    theme.bgColor,
                    theme.borderColor,
                    isSelected && 'ring-2 ring-blue-400 ring-offset-1',
                    (isDragging || isDraggingFromParent) && 'opacity-40'
                )}
            >
                {/* Header */}
                <div className='flex items-center justify-between gap-2 mb-2'>
                    <div
                        {...listeners}
                        {...attributes}
                        className='flex items-center gap-2 flex-1 cursor-grab active:cursor-grabbing select-none'
                    >
                        <span className='text-2xl'>{icon}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${theme.bgColorDark}`}>
                            {module.moduleId}
                        </span>
                        <span className='text-sm font-semibold text-zinc-700 flex-1 truncate'>
                            {label}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className='flex items-center gap-1'>
                        <button
                            type='button'
                            onClick={() => shared.onSelect(module.id)}
                            className='px-2 py-1 text-xs rounded hover:bg-zinc-200 transition-colors'
                            title='編輯'
                        >
                            ✏️
                        </button>
                        <button
                            type='button'
                            onClick={() => shared.onRemove(module.id)}
                            className='px-2 py-1 text-xs rounded hover:bg-red-100 hover:text-red-600 transition-colors'
                            title='刪除'
                        >
                            🗑️
                        </button>
                    </div>
                </div>

                {/* 實際模組預覽 */}
                {Module && (
                    <div className='bg-white rounded p-3 mt-2 border border-zinc-200'>
                        <Module data={module.data} style={module.style} />
                    </div>
                )}
            </div>
        </div>
    );
}

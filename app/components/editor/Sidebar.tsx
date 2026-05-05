'use client';

import { useState } from 'react';
import LayoutSidebar from './LayoutSidebar';
import ComponentSidebar from './component/ComponentSidebar';
import LayoutEditor from './LayoutEditor';
import ComponentEditor from './component/ComponentEditor';
import type { LayoutSpacing, NestedLayout, ComponentNode } from './types';

export default function Sidebar({
    selectedLayout,
    selectedComponent,
    onAddSlot,
    onRemoveSlot,
    onUpdateSpacing,
    onUpdateGridDimensions,
    onUpdateFlexGap,
    onUpdateFlexRowGap,
    onUpdateFlexWrap,
    onUpdateComponentData,
    onUpdateComponentStyle,
    onDeselect,
}: {
    selectedLayout: NestedLayout | null;
    selectedComponent: ComponentNode | null;
    onAddSlot: (layoutId: string) => void;
    onRemoveSlot: (layoutId: string, slotId: string) => void;
    onUpdateSpacing: (layoutId: string, spacing: LayoutSpacing) => void;
    onUpdateGridDimensions?: (
        layoutId: string,
        colWidths: number[],
        rowHeights: number[],
        colGap: number | null,
        rowGap: number | null,
    ) => void;
    onUpdateFlexGap?: (layoutId: string, flexGap: number) => void;
    onUpdateFlexRowGap?: (layoutId: string, flexRowGap: number) => void;
    onUpdateFlexWrap?: (layoutId: string, flexWrap: boolean) => void;
    onUpdateComponentData: (componentId: string, data: Record<string, unknown>) => void;
    onUpdateComponentStyle: (componentId: string, style: Record<string, unknown>) => void;
    onDeselect: () => void;
}) {
    const [activeTab, setActiveTab] = useState<'layouts' | 'components'>(
        'layouts',
    );

    return (
        <aside className='w-64 shrink-0 border-r border-zinc-200 bg-zinc-50 flex flex-col h-full overflow-x-hidden'>
            {/* 如果有選中的 Layout 或 Component，顯示對應的編輯器 */}
            {selectedLayout ? (
                <LayoutEditor
                    layout={selectedLayout}
                    onAddSlot={onAddSlot}
                    onRemoveSlot={onRemoveSlot}
                    onUpdateSpacing={onUpdateSpacing}
                    onUpdateGridDimensions={onUpdateGridDimensions}
                    onUpdateFlexGap={onUpdateFlexGap}
                    onUpdateFlexRowGap={onUpdateFlexRowGap}
                    onUpdateFlexWrap={onUpdateFlexWrap}
                    onDeselect={onDeselect}
                />
            ) : selectedComponent ? (
                <ComponentEditor
                    component={selectedComponent}
                    onUpdateData={onUpdateComponentData}
                    onUpdateStyle={onUpdateComponentStyle}
                    onDeselect={onDeselect}
                />
            ) : (
                <>
                    {/* Tab 切換 */}
                    <div className='border-b border-zinc-200'>
                        <div className='flex'>
                            <button
                                onClick={() => setActiveTab('layouts')}
                                className={`flex-1 px-4 py-3 text-sm font-medium cursor-pointer transition-colors ${
                                    activeTab === 'layouts'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                        : 'text-zinc-600 hover:text-zinc-800'
                                }`}
                            >
                                Layouts
                            </button>
                            <button
                                onClick={() => setActiveTab('components')}
                                className={`flex-1 px-4 py-3 text-sm font-medium cursor-pointer transition-colors ${
                                    activeTab === 'components'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                        : 'text-zinc-600 hover:text-zinc-800'
                                }`}
                            >
                                Components
                            </button>
                        </div>
                    </div>

                    {/* 內容區域 */}
                    {activeTab === 'layouts' ? (
                        <LayoutSidebar />
                    ) : (
                        <ComponentSidebar />
                    )}
                </>
            )}
        </aside>
    );
}

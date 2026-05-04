'use client';

import { createElement } from 'react';
import type { ComponentNode } from '@/types/layout';
import { getInspector } from './inspector';

export default function ComponentEditor({
    component,
    onUpdateData,
    onUpdateStyle,
    onDeselect,
}: {
    component: ComponentNode;
    onUpdateData: (componentId: string, data: Record<string, unknown>) => void;
    onUpdateStyle: (
        componentId: string,
        style: Record<string, unknown>,
    ) => void;
    onDeselect: () => void;
}) {
    // 取得對應的 Inspector 元件
    const InspectorComponent = getInspector(component.componentId);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-200">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-zinc-800">
                        編輯元件
                    </h3>
                    <button
                        onClick={onDeselect}
                        className="text-zinc-400 hover:text-zinc-600 transition-colors"
                        title="關閉"
                    >
                        ✕
                    </button>
                </div>
                <p className="text-xs text-zinc-500">{component.label}</p>
            </div>

            {/* 內容 */}
            <div className="flex-1 overflow-y-auto p-4">
                {InspectorComponent
                    ? createElement(InspectorComponent, {
                          data: component.data,
                          style: component.style,
                          onUpdateData: (newData) =>
                              onUpdateData(component.id, newData),
                          onUpdateStyle: (newStyle) =>
                              onUpdateStyle(component.id, newStyle),
                      })
                    : (
                    <div className="text-xs text-zinc-400">
                        尚未建立編輯器
                    </div>
                )}
            </div>
        </div>
    );
}

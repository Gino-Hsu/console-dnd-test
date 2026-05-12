'use client';

import { createElement } from 'react';
import type { ModuleNode } from '@/types/layout';
import { getInspector } from './inspector';

export default function ModuleEditor({
    module,
    onUpdateData,
    onUpdateStyle,
    onDeselect,
}: {
    module: ModuleNode;
    onUpdateData: (moduleId: string, data: Record<string, unknown>) => void;
    onUpdateStyle: (
        moduleId: string,
        style: Record<string, unknown>,
    ) => void;
    onDeselect: () => void;
}) {
    // 取得模組對應的 Inspector
    const Inspector = getInspector(module.moduleId);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-200">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-zinc-800">
                        編輯模組
                    </h3>
                    <button
                        onClick={onDeselect}
                        className="text-zinc-400 hover:text-zinc-600 transition-colors"
                        title="關閉"
                    >
                        ✕
                    </button>
                </div>
                <p className="text-xs text-zinc-500">{module.label}</p>
            </div>

            {/* 內容 */}
            <div className="flex-1 overflow-y-auto p-4">
                {Inspector
                    ? createElement(Inspector, {
                          data: module.data,
                          style: module.style,
                          onUpdateData: (newData) =>
                              onUpdateData(module.id, newData),
                          onUpdateStyle: (newStyle) =>
                              onUpdateStyle(module.id, newStyle),
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

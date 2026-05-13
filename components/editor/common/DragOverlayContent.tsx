import type { SidebarDragItem, CanvasNode } from '@/types/layout';
import { isLayoutNode } from '@/types/layout';
import { moduleRegistry } from '@/lib/module-registry';
import { CATEGORY_THEMES, DEFAULT_THEME } from '@/lib/theme/category-themes';

interface DragOverlayContentProps {
    activeSidebarItem: SidebarDragItem | null;
    activeCanvasNode: CanvasNode | null;
}

export default function DragOverlayContent({
    activeSidebarItem,
    activeCanvasNode,
}: DragOverlayContentProps) {
    const undefindedName = '未命名項目';
    let label = '';
    let color = '';

    if (activeSidebarItem) {
        // 從 Sidebar 拖動
        if (activeSidebarItem.type === 'layout') {
            // Sidebar Layout
            label = activeSidebarItem.label || undefindedName;
            color = activeSidebarItem.layoutType === 'block'
                ? 'border-violet-400 bg-violet-100 text-violet-700'
                : activeSidebarItem.layoutType === 'flex'
                  ? 'border-sky-400 bg-sky-100 text-sky-700'
                  : 'border-emerald-400 bg-emerald-100 text-emerald-700';
        } else {
            // Sidebar Module
            label = activeSidebarItem.label ? `${activeSidebarItem.moduleId} ${activeSidebarItem.label}` : undefindedName;
            const config = moduleRegistry[activeSidebarItem.moduleId];
            const theme = config
                ? CATEGORY_THEMES[config.category] || DEFAULT_THEME
                : DEFAULT_THEME;
            const bgClass = theme.bgColor;
            const borderClass = theme.borderColor;
            const textClass = theme.textColor;
            color = `${borderClass} ${bgClass} ${textClass}`;
        }
    } else if (activeCanvasNode) {
        // 從 Canvas 拖動
        if (isLayoutNode(activeCanvasNode)) {
            // Canvas Layout
            label = activeCanvasNode.label || undefindedName;
            color = activeCanvasNode.layoutType === 'block'
                ? 'border-violet-400 bg-violet-100 text-violet-700'
                : activeCanvasNode.layoutType === 'flex'
                  ? 'border-sky-400 bg-sky-100 text-sky-700'
                  : 'border-emerald-400 bg-emerald-100 text-emerald-700';
        } else {
            // Canvas Module
            label = activeCanvasNode.label ? `${activeCanvasNode.moduleId} ${activeCanvasNode.label}` : undefindedName;
            const config = moduleRegistry[activeCanvasNode.moduleId];
            const theme = config
                ? CATEGORY_THEMES[config.category] || DEFAULT_THEME
                : DEFAULT_THEME;
            const bgClass = theme.bgColor;
            const borderClass = theme.borderColor;
            const textClass = theme.textColor;
            color = `${borderClass} ${bgClass} ${textClass}`;
        }
    }

    return (
        <div
            className={`rounded-lg border-2 px-4 py-3 shadow-lg font-semibold text-sm opacity-80 ${color}`}
        >
            {label}
        </div>
    );
}

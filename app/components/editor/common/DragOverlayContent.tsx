import type { LayoutType, NestedLayout } from '@/types/layout';

interface DragOverlayContentProps {
    activeSidebarType: LayoutType | null;
    activeCanvasLayout: NestedLayout | null;
}

export default function DragOverlayContent({
    activeSidebarType,
    activeCanvasLayout,
}: DragOverlayContentProps) {
    const overlayLabel =
        activeSidebarType === 'block'
            ? '塊級 Layout'
            : activeSidebarType === 'flex'
              ? 'Flex Layout'
              : 'Grid Layout';

    const overlayColor =
        activeSidebarType === 'block'
            ? 'border-violet-400 bg-violet-100 text-violet-700'
            : activeSidebarType === 'flex'
              ? 'border-sky-400 bg-sky-100 text-sky-700'
              : 'border-emerald-400 bg-emerald-100 text-emerald-700';

    const canvasOverlayColor = activeCanvasLayout
        ? activeCanvasLayout.layoutType === 'block'
            ? 'border-violet-400 bg-violet-100 text-violet-700'
            : activeCanvasLayout.layoutType === 'flex'
              ? 'border-sky-400 bg-sky-100 text-sky-700'
              : 'border-emerald-400 bg-emerald-100 text-emerald-700'
        : '';

    return (
        <>
            {activeSidebarType ? (
                <div
                    className={`rounded-lg border-2 px-4 py-3 shadow-lg font-semibold text-sm ${overlayColor}`}
                >
                    {overlayLabel}
                </div>
            ) : activeCanvasLayout ? (
                <div
                    className={`rounded-lg border-2 px-4 py-3 shadow-lg font-semibold text-sm opacity-80 ${canvasOverlayColor}`}
                >
                    {activeCanvasLayout.label}
                </div>
            ) : null}
        </>
    );
}

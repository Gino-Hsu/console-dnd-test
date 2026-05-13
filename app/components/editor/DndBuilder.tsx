'use client';

import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core';
import { useCallback, useId } from 'react';
import { useDndBuilder, useLayoutEditor, useComponentEditor } from '@/hooks';
import CanvasArea from './CanvasArea';
import { findLayoutById, findNodeById } from '@/lib/page';
import Sidebar from './Sidebar';
import { isLayoutNode } from '@/types/layout';

export default function DndBuilder() {
    const {
        graph,
        layouts,
        setLayouts,
        isLoading,
        loadError,
        selectedLayoutId,
        selectedLayout,
        handleRemove,
        handleSelect: handleSelectLayout,
        handleAddSlot,
        handleRemoveSlot,
        handleUpdateSpacing,
        handleUpdateSlotWidths,
        handleUpdateWrapSlotWidth,
        handleUpdateGridDimensions,
        handleUpdateFlexGap,
        handleUpdateFlexWrap,
        handleUpdateFlexRowGap,
        handleUpdateSlotAlign,
        handleUpdateContainerWidth,
        deselectLayout,
        isSaving,
    } = useLayoutEditor();

    const {
        selectedComponentId,
        selectedComponent,
        handleSelectComponent,
        handleUpdateComponentData,
        handleUpdateComponentStyle,
        deselectComponent,
    } = useComponentEditor({ layouts, setLayouts });

    const {
        sensors,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleDragCancel,
        activeSidebarType,
        activeCanvasId,
        insertIndex,
        insertSlotId,
    } = useDndBuilder({ layouts, setLayouts });

    // 統一的選取邏輯：判斷是 Layout 還是 Component
    const handleSelect = useCallback(
        (id: string) => {
            const node = findNodeById(id, layouts);
            if (node && isLayoutNode(node)) {
                handleSelectLayout(id);
                deselectComponent();
            } else {
                handleSelectComponent(id);
                deselectLayout();
            }
        },
        [
            layouts,
            handleSelectLayout,
            handleSelectComponent,
            deselectComponent,
            deselectLayout,
        ],
    );

    const dndId = useId();

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

    const activeCanvasLayout = activeCanvasId
        ? findLayoutById(activeCanvasId, layouts)
        : null;

    const canvasOverlayColor = activeCanvasLayout
        ? activeCanvasLayout.layoutType === 'block'
            ? 'border-violet-400 bg-violet-100 text-violet-700'
            : activeCanvasLayout.layoutType === 'flex'
              ? 'border-sky-400 bg-sky-100 text-sky-700'
              : 'border-emerald-400 bg-emerald-100 text-emerald-700'
        : '';

    if (isLoading) {
        return (
            <div className='flex h-screen w-full items-center justify-center bg-zinc-50'>
                <div className='text-center text-zinc-400'>
                    <svg
                        className='animate-spin mx-auto mb-3'
                        width='28'
                        height='28'
                        viewBox='0 0 28 28'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2.5'
                    >
                        <path
                            d='M14 3a11 11 0 1 1-7.778 3.222'
                            strokeLinecap='round'
                        />
                    </svg>
                    <p className='text-sm font-medium'>載入中…</p>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className='flex h-screen w-full items-center justify-center bg-zinc-50'>
                <div className='text-center text-zinc-400'>
                    <p className='text-2xl mb-2'>⚠️</p>
                    <p className='font-medium text-zinc-600'>
                        無法載入頁面資料
                    </p>
                    <p className='text-sm mt-1'>
                        請確認{' '}
                        <code className='bg-zinc-100 px-1 rounded'>
                            pnpm db
                        </code>{' '}
                        已在執行中
                    </p>
                    <p className='text-xs mt-2 text-zinc-300'>{loadError}</p>
                </div>
            </div>
        );
    }

    return (
        <DndContext
            id={dndId}
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className='flex h-screen w-full overflow-hidden'>
                <Sidebar
                    selectedLayout={selectedLayout}
                    selectedLayoutIsRoot={
                        selectedLayout
                            ? layouts.some(l => l.id === selectedLayout.id)
                            : false
                    }
                    selectedComponent={selectedComponent}
                    onAddSlot={handleAddSlot}
                    onRemoveSlot={handleRemoveSlot}
                    onUpdateSpacing={handleUpdateSpacing}
                    onUpdateGridDimensions={handleUpdateGridDimensions}
                    onUpdateFlexGap={handleUpdateFlexGap}
                    onUpdateFlexRowGap={handleUpdateFlexRowGap}
                    onUpdateFlexWrap={handleUpdateFlexWrap}
                    onUpdateContainerWidth={handleUpdateContainerWidth}
                    onUpdateComponentData={handleUpdateComponentData}
                    onUpdateComponentStyle={handleUpdateComponentStyle}
                    onDeselect={() => {
                        deselectLayout();
                        deselectComponent();
                    }}
                />
                <CanvasArea
                    graph={graph}
                    layouts={layouts}
                    onRemove={handleRemove}
                    onSelect={handleSelect}
                    selectedLayoutId={selectedLayoutId}
                    insertIndex={insertSlotId === null ? insertIndex : null}
                    insertSlotId={insertSlotId}
                    slotInsertIndex={insertSlotId !== null ? insertIndex : null}
                    isSomethingDragging={activeCanvasId !== null}
                    onUpdateSlotWidths={handleUpdateSlotWidths}
                    onUpdateGridDimensions={handleUpdateGridDimensions}
                    onUpdateWrapSlotWidth={handleUpdateWrapSlotWidth}
                    onUpdateSlotAlign={handleUpdateSlotAlign}
                    isSaving={isSaving}
                />
            </div>

            <DragOverlay dropAnimation={null}>
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
            </DragOverlay>
        </DndContext>
    );
}

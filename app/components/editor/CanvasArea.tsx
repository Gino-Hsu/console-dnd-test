'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useCallback, useState } from 'react';
import LayoutCard from './layout/LayoutCard';
import type { NestedLayout, PageGraph } from '@/types/layout';
import { publishPage } from '@/lib/api/page';

/*  插入線  */
export function InsertLine() {
  return (
    <div className="w-full relative top-1 h-0 pointer-events-none overflow-visible mb-2">
      <div className="absolute inset-x-0 -top-px h-0.5 bg-blue-500 rounded-full">
        <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-blue-500" />
        <div className="absolute -right-1 -top-1.5 w-3 h-3 rounded-full bg-blue-500" />
      </div>
    </div>
  );
}

/*  畫布主元件  */
export default function CanvasArea({
  graph,
  layouts,
  onRemove,
  onSelect,
  selectedLayoutId,
  insertIndex,
  insertSlotId,
  slotInsertIndex,
  isSomethingDragging,
  isSaving = false,
  onUpdateSlotWidths,
  onUpdateGridDimensions,
  onUpdateWrapSlotWidth,
  onUpdateSlotAlign,
}: {
  graph: PageGraph | null;
  layouts: NestedLayout[];
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
  selectedLayoutId: string | null;
  insertIndex: number | null;
  insertSlotId: string | null;
  slotInsertIndex: number | null;
  isSomethingDragging: boolean;
  isSaving?: boolean;
  onUpdateSlotWidths: (layoutId: string, widths: number[]) => void;
  onUpdateGridDimensions: (
    layoutId: string,
    colWidths: number[],
    rowHeights: number[],
    colGap: number | null,
    rowGap: number | null,
  ) => void;
  onUpdateWrapSlotWidth?: (
    layoutId: string,
    slotId: string,
    widthPx: number,
  ) => void;
  onUpdateSlotAlign?: (
    layoutId: string,
    slotId: string,
    align: import('@/types/layout').SlotAlign,
  ) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
    data: { type: 'canvas', depth: 0 },
  });

  type PublishState = 'idle' | 'loading' | 'success' | 'error';
  const [publishState, setPublishState] = useState<PublishState>('idle');

  const handlePublish = useCallback(async () => {
    if (!graph) return;
    setPublishState('loading');
    try {
      await publishPage(graph);
      setPublishState('success');
      setTimeout(() => setPublishState('idle'), 2000);
      window.open('/frontpage', '_blank');
    } catch (err) {
      console.error('發布失敗', err);
      setPublishState('error');
      setTimeout(() => setPublishState('idle'), 3000);
    }
  }, [graph]);

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex justify-between px-6 py-4 border-b border-zinc-200 bg-white">
        <div>
          <h2 className="text-base font-bold text-zinc-800">畫布</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            拖曳 Layout 到此畫布，或將 Layout 放入 Slot 中
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isSaving && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
              <svg
                className="animate-spin"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 1a5 5 0 1 1-3.536 1.464" strokeLinecap="round" />
              </svg>
              儲存草稿中…
            </span>
          )}
          <button
            onClick={handlePublish}
            disabled={publishState === 'loading'}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
              publishState === 'success'
                ? 'bg-green-600'
                : publishState === 'error'
                  ? 'bg-red-600'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {publishState === 'loading' ? (
              <>
                <svg
                  className="animate-spin"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 1a6 6 0 1 1-4.243 1.757" strokeLinecap="round" />
                </svg>
                發布中…
              </>
            ) : publishState === 'success' ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 7l4 4 6-6" />
                </svg>
                已發布
              </>
            ) : publishState === 'error' ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M7 2v5M7 10v1" />
                </svg>
                發布失敗
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 1v8M4 6l3 3 3-3" />
                  <path d="M1 10v1a2 2 0 002 2h8a2 2 0 002-2v-1" />
                </svg>
                發布
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-zinc-100">
        <SortableContext
          items={layouts.map(l => l.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            ref={setNodeRef}
            data-root-canvas
            className={`min-h-full rounded-xl border-2 border-dashed p-3 flex flex-col gap-2 transition-colors ${
              isOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-zinc-300 bg-zinc-100'
            }`}
          >
            {layouts.length === 0 ? (
              <div
                className={`flex items-center justify-center h-64 rounded-xl transition-colors ${
                  isOver ? 'text-blue-400' : 'text-zinc-400'
                }`}
              >
                <div className="text-center">
                  <p className="text-lg mb-1"></p>
                  <p className="text-sm font-medium">拖曳 Layout 到此畫布</p>
                </div>
              </div>
            ) : (
              <>
                {insertIndex === 0 && <InsertLine />}
                {layouts.map((layout, index) => (
                  <div key={layout.id} data-canvas-item>
                    <LayoutCard
                      layout={layout}
                      onRemove={onRemove}
                      onSelect={onSelect}
                      selectedLayoutId={selectedLayoutId}
                      insertSlotId={insertSlotId}
                      slotInsertIndex={slotInsertIndex}
                      isSomethingDragging={isSomethingDragging}
                      onUpdateSlotWidths={onUpdateSlotWidths}
                      onUpdateGridDimensions={onUpdateGridDimensions}
                      onUpdateWrapSlotWidth={onUpdateWrapSlotWidth}
                      onUpdateSlotAlign={onUpdateSlotAlign}
                    />
                    {insertIndex === index + 1 && <InsertLine />}
                  </div>
                ))}
              </>
            )}
          </div>
        </SortableContext>
      </div>
    </main>
  );
}

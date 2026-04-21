'use client';

import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCallback, useRef } from 'react';
import {
    gridColHandleLeft,
    gridContainerStyle,
    gridRowHandleTop,
    layoutTheme,
    resizeFlexSlots,
    resizeGridCols,
    resizeGridRows,
} from '@/lib/layout/resizeUtils';
import { InsertLine } from './CanvasArea';
import ResizeHandle from './ResizeHandle';
import type { NestedLayout } from './types';

interface SharedProps {
    onRemove: (id: string) => void;
    onSelect: (id: string) => void;
    selectedLayoutId: string | null;
    insertSlotId: string | null;
    slotInsertIndex: number | null;
    onUpdateSlotWidths?: (layoutId: string, widths: number[]) => void;
    onUpdateGridDimensions?: (
        layoutId: string,
        colWidths: number[],
        rowHeights: number[],
        colGap?: number,
        rowGap?: number,
    ) => void;
}

function SlotZone({
    slot,
    ownerId,
    flexBasis,
    isGridItem,
    ...shared
}: SharedProps & {
    slot: { id: string; label?: string; children: NestedLayout[] };
    ownerId: string;
    flexBasis?: number;
    isGridItem?: boolean;
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: slot.id,
        data: { type: 'slot', ownerId, slotId: slot.id },
    });
    const isActive = shared.insertSlotId === slot.id;
    return (
        <div
            className={[
                flexBasis !== undefined ? 'min-w-0' : 'flex-1 min-w-0',
                isGridItem ? 'h-full' : '',
            ].join(' ')}
            style={
                flexBasis !== undefined
                    ? { flexBasis: `${flexBasis}%`, flexShrink: 0, flexGrow: 0 }
                    : undefined
            }
            data-slot-id={slot.id}
        >
            {slot.label && (
                <div className='text-xs font-medium text-zinc-400 mb-1 select-none'>
                    {slot.label}
                </div>
            )}
            <SortableContext
                items={slot.children.map(c => c.id)}
                strategy={verticalListSortingStrategy}
            >
                <div
                    ref={setNodeRef}
                    className={[
                        'rounded-lg border-2 border-dashed h-full p-4 flex flex-col gap-2 transition-colors',
                        isGridItem ? 'h-full' : 'min-h-16',
                        isOver
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-zinc-200 bg-white/60',
                    ].join(' ')}
                >
                    {slot.children.length === 0 ? (
                        <>
                            {isActive && shared.slotInsertIndex === 0 && (
                                <InsertLine />
                            )}
                            <div
                                className={`flex items-center justify-center h-full text-xs select-none transition-colors ${isOver ? 'text-blue-400' : 'text-zinc-300'}`}
                            >
                                拖曳 Layout 到此 slot
                            </div>
                        </>
                    ) : (
                        <>
                            {isActive && shared.slotInsertIndex === 0 && (
                                <InsertLine />
                            )}
                            {slot.children.map((child, idx) => (
                                <div key={child.id} data-canvas-item>
                                    <div className='py-1'>
                                        <LayoutCard
                                            layout={child}
                                            depth={1}
                                            {...shared}
                                        />
                                    </div>
                                    {isActive &&
                                        shared.slotInsertIndex === idx + 1 && (
                                            <InsertLine />
                                        )}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}

export default function LayoutCard({
    layout,
    depth = 0,
    ...shared
}: SharedProps & { layout: NestedLayout; depth?: number }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: layout.id });
    const sortStyle: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const flexRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const cols = layout.gridColWidths?.length ?? 2;
    const rows = Math.max(1, Math.ceil(layout.slots.length / cols));
    const defColW = 100 / cols;
    const defRowH = 120;

    const handleFlexDrag = useCallback(
        (i: number, dx: number) => {
            if (!flexRef.current || !shared.onUpdateSlotWidths) return;
            const tw = flexRef.current.offsetWidth;
            if (!tw) return;
            const eq = 100 / layout.slots.length;
            shared.onUpdateSlotWidths(
                layout.id,
                resizeFlexSlots(
                    layout.slots.map(s => s.flexBasis ?? eq),
                    i,
                    (dx / tw) * 100,
                ),
            );
        },
        [layout, shared.onUpdateSlotWidths],
    );

    const handleColDrag = useCallback(
        (i: number, dx: number) => {
            if (!gridRef.current || !shared.onUpdateGridDimensions) return;
            const tw = gridRef.current.offsetWidth;
            if (!tw) return;
            const cw =
                layout.gridColWidths ??
                Array.from({ length: cols }, () => defColW);
            shared.onUpdateGridDimensions(
                layout.id,
                resizeGridCols(cw, i, (dx / tw) * 100),
                layout.gridRowHeights ??
                    Array.from({ length: rows }, () => defRowH),
                layout.gridColGap,
                layout.gridRowGap,
            );
        },
        [layout, cols, rows, defColW, defRowH, shared.onUpdateGridDimensions],
    );

    const handleRowDrag = useCallback(
        (i: number, dy: number) => {
            if (!shared.onUpdateGridDimensions) return;
            const rh =
                layout.gridRowHeights ??
                Array.from({ length: rows }, () => defRowH);
            shared.onUpdateGridDimensions(
                layout.id,
                layout.gridColWidths ??
                    Array.from({ length: cols }, () => defColW),
                resizeGridRows(rh, i, dy),
                layout.gridColGap,
                layout.gridRowGap,
            );
        },
        [layout, cols, rows, defColW, defRowH, shared.onUpdateGridDimensions],
    );

    const { borderColor, bgColor } = layoutTheme(layout.type, depth);
    const isBlock = layout.type === 'block',
        isFlex = layout.type === 'flex',
        isGrid = layout.type === 'grid';
    const isSelected = shared.selectedLayoutId === layout.id;

    const { margin: m, padding: p } = layout.spacing ?? {
        margin: {},
        padding: {},
    };
    const [mt, mr, mb, ml] = [
        m?.top ?? 0,
        m?.right ?? 0,
        m?.bottom ?? 0,
        m?.left ?? 0,
    ];
    const [pt, pr, pb, pl] = [
        p?.top ?? 0,
        p?.right ?? 0,
        p?.bottom ?? 0,
        p?.left ?? 0,
    ];
    const hasMargin = mt + mr + mb + ml > 0;
    const hasPadding = pt + pr + pb + pl > 0;

    const sp = { ownerId: layout.id, ...shared };

    return (
        <div
            style={{
                paddingTop: mt,
                paddingRight: mr,
                paddingBottom: mb,
                paddingLeft: ml,
            }}
            className={`rounded-xl transition-colors ${hasMargin ? 'bg-amber-100/60 outline-dashed outline-1 outline-amber-300' : ''}`}
        >
            <div
                ref={setNodeRef}
                style={sortStyle}
                className={`relative rounded-lg border-2 group transition-colors ${borderColor} ${bgColor} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
            >
                {hasPadding && (
                    <>
                        {pt > 0 && (
                            <div
                                className='absolute inset-x-0 top-0 bg-green-200/60 pointer-events-none z-10 rounded-t-lg'
                                style={{ height: pt }}
                            />
                        )}
                        {pb > 0 && (
                            <div
                                className='absolute inset-x-0 bottom-0 bg-green-200/60 pointer-events-none z-10 rounded-b-lg'
                                style={{ height: pb }}
                            />
                        )}
                        {pl > 0 && (
                            <div
                                className='absolute inset-y-0 left-0 bg-green-200/60 pointer-events-none z-10'
                                style={{ width: pl }}
                            />
                        )}
                        {pr > 0 && (
                            <div
                                className='absolute inset-y-0 right-0 bg-green-200/60 pointer-events-none z-10'
                                style={{ width: pr }}
                            />
                        )}
                    </>
                )}
                <div
                    style={{
                        paddingTop: Math.max(pt, 12),
                        paddingRight: Math.max(pr, 12),
                        paddingBottom: Math.max(pb, 12),
                        paddingLeft: Math.max(pl, 12),
                    }}
                >
                    <div
                        className='flex items-center gap-2 mb-3 cursor-pointer'
                        onClick={() => shared.onSelect(layout.id)}
                    >
                        <button
                            {...listeners}
                            {...attributes}
                            className='cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 shrink-0'
                            aria-label='拖曳排序'
                        >
                            <svg
                                width='14'
                                height='14'
                                viewBox='0 0 14 14'
                                fill='currentColor'
                            >
                                <circle cx='4' cy='3' r='1.5' />
                                <circle cx='10' cy='3' r='1.5' />
                                <circle cx='4' cy='7' r='1.5' />
                                <circle cx='10' cy='7' r='1.5' />
                                <circle cx='4' cy='11' r='1.5' />
                                <circle cx='10' cy='11' r='1.5' />
                            </svg>
                        </button>
                        <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${isBlock ? 'bg-violet-200 text-violet-700' : isFlex ? 'bg-sky-200 text-sky-700' : 'bg-emerald-200 text-emerald-700'}`}
                        >
                            {isBlock ? 'Block' : isFlex ? 'Flex' : 'Grid'}
                        </span>
                        <span className='text-sm font-semibold text-zinc-700 flex-1 truncate'>
                            {layout.label}
                        </span>
                        <button
                            onClick={() => shared.onRemove(layout.id)}
                            className='opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-500 rounded p-0.5 shrink-0'
                            aria-label='移除此 Layout'
                        >
                            <svg
                                width='12'
                                height='12'
                                viewBox='0 0 14 14'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                            >
                                <path d='M2 2l10 10M12 2L2 12' />
                            </svg>
                        </button>
                    </div>
                    {layout.slots.length > 0 && (
                        <div
                            ref={
                                isFlex ? flexRef : isGrid ? gridRef : undefined
                            }
                            className={
                                isBlock
                                    ? 'flex flex-col gap-2'
                                    : isFlex
                                      ? 'flex flex-row'
                                      : 'relative'
                            }
                            style={
                                isGrid
                                    ? gridContainerStyle(
                                          layout,
                                          cols,
                                          rows,
                                          defColW,
                                          defRowH,
                                      )
                                    : undefined
                            }
                        >
                            {isFlex ? (
                                layout.slots.map((slot, i) => (
                                    <div
                                        key={slot.id}
                                        className='flex min-w-0'
                                        style={{
                                            flexBasis: `${slot.flexBasis ?? 100 / layout.slots.length}%`,
                                            flexShrink: 0,
                                            flexGrow: 0,
                                        }}
                                    >
                                        <SlotZone slot={slot} {...sp} />
                                        {i < layout.slots.length - 1 && (
                                            <ResizeHandle
                                                onDrag={dx =>
                                                    handleFlexDrag(i, dx)
                                                }
                                            />
                                        )}
                                    </div>
                                ))
                            ) : isGrid ? (
                                <>
                                    {layout.slots.map(slot => (
                                        <SlotZone
                                            key={slot.id}
                                            slot={slot}
                                            isGridItem
                                            {...sp}
                                        />
                                    ))}
                                    {Array.from(
                                        { length: cols - 1 },
                                        (_, i) => {
                                            const cw =
                                                layout.gridColWidths ??
                                                Array.from(
                                                    { length: cols },
                                                    () => defColW,
                                                );
                                            return (
                                                <div
                                                    key={`col-${i}`}
                                                    className='absolute top-0 bottom-0 z-20 flex items-stretch'
                                                    style={{
                                                        left: gridColHandleLeft(
                                                            cw,
                                                            i,
                                                            layout.gridColGap ??
                                                                8,
                                                        ),
                                                        width: '8px',
                                                    }}
                                                >
                                                    <ResizeHandle
                                                        direction='col'
                                                        onDrag={dx =>
                                                            handleColDrag(i, dx)
                                                        }
                                                    />
                                                </div>
                                            );
                                        },
                                    )}
                                    {Array.from(
                                        { length: rows - 1 },
                                        (_, i) => {
                                            const rh =
                                                layout.gridRowHeights ??
                                                Array.from(
                                                    { length: rows },
                                                    () => defRowH,
                                                );
                                            return (
                                                <div
                                                    key={`row-${i}`}
                                                    className='absolute left-0 right-0 z-20 flex flex-col justify-stretch'
                                                    style={{
                                                        top: `calc(${gridRowHandleTop(rh, i, layout.gridRowGap ?? 8)}px - 4px)`,
                                                        height: '8px',
                                                    }}
                                                >
                                                    <ResizeHandle
                                                        direction='row'
                                                        onDrag={dy =>
                                                            handleRowDrag(i, dy)
                                                        }
                                                    />
                                                </div>
                                            );
                                        },
                                    )}
                                </>
                            ) : (
                                layout.slots.map(slot => (
                                    <SlotZone
                                        key={slot.id}
                                        slot={slot}
                                        {...sp}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

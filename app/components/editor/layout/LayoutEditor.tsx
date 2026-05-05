'use client';

import { useState } from 'react';
import type { LayoutSpacing, NestedLayout, SpacingValue } from '@/types/layout';
import { DEFAULT_SPACING } from '@/types/layout';

/* ── 小工具：手風琴 header ─────────────────────────── */
function AccordionHeader({
    label,
    count,
    open,
    onToggle,
    action,
}: {
    label: string;
    count?: number;
    open: boolean;
    onToggle: () => void;
    action?: React.ReactNode;
}) {
    return (
        <div className='flex items-center justify-between'>
            <button
                onClick={onToggle}
                className='flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide hover:text-zinc-700 transition-colors'
            >
                <svg
                    width='10'
                    height='10'
                    viewBox='0 0 10 10'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    className={`transition-transform ${open ? 'rotate-90' : ''}`}
                >
                    <path d='M3 2l4 3-4 3' />
                </svg>
                {label}
                {count !== undefined && (
                    <span className='ml-0.5 text-zinc-400 normal-case font-normal'>
                        （{count}）
                    </span>
                )}
            </button>
            {action}
        </div>
    );
}

/* ── 間距輸入器（四方向） ────────────────────────────── */
function SpacingInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: SpacingValue;
    onChange: (next: SpacingValue) => void;
}) {
    const sides: { key: keyof SpacingValue; abbr: string }[] = [
        { key: 'top', abbr: '上' },
        { key: 'right', abbr: '右' },
        { key: 'bottom', abbr: '下' },
        { key: 'left', abbr: '左' },
    ];

    return (
        <div>
            <p className='text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5'>
                {label}
            </p>
            <div className='grid grid-cols-4 gap-1'>
                {sides.map(({ key, abbr }) => (
                    <div
                        key={key}
                        className='flex flex-col items-center gap-0.5'
                    >
                        <input
                            type='number'
                            min={0}
                            max={999}
                            value={value[key]}
                            onChange={e =>
                                onChange({
                                    ...value,
                                    [key]: Math.max(
                                        0,
                                        parseInt(e.target.value, 10) || 0,
                                    ),
                                })
                            }
                            className='w-full text-center text-xs border border-zinc-200 rounded px-1 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition'
                        />
                        <span className='text-[10px] text-zinc-400'>
                            {abbr}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── 主元件 ─────────────────────────────────────────── */
export default function LayoutEditor({
    layout,
    onAddSlot,
    onRemoveSlot,
    onUpdateSpacing,
    onUpdateGridDimensions,
    onUpdateFlexGap,
    onUpdateFlexRowGap,
    onUpdateFlexWrap,
    onDeselect,
}: {
    layout: NestedLayout;
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
    onDeselect: () => void;
}) {
    const [slotsOpen, setSlotsOpen] = useState(true);
    const [gridOpen, setGridOpen] = useState(true);
    const [flexOpen, setFlexOpen] = useState(true);
    const [spacingOpen, setSpacingOpen] = useState(true);

    const spacing = layout.spacing ?? DEFAULT_SPACING;

    const isBlock = layout.type === 'block';
    const accentColor = isBlock
        ? 'text-violet-700 bg-violet-100 border-violet-200'
        : layout.type === 'flex'
          ? 'text-sky-700 bg-sky-100 border-sky-200'
          : 'text-emerald-700 bg-emerald-100 border-emerald-200';

    const badgeColor = isBlock
        ? 'bg-violet-200 text-violet-700'
        : layout.type === 'flex'
          ? 'bg-sky-200 text-sky-700'
          : 'bg-emerald-200 text-emerald-700';

    const typeLabel = isBlock
        ? 'Block'
        : layout.type === 'flex'
          ? 'Flex'
          : 'Grid';

    const updatePadding = (next: SpacingValue) =>
        onUpdateSpacing(layout.id, { ...spacing, padding: next });
    const updateMargin = (next: SpacingValue) =>
        onUpdateSpacing(layout.id, { ...spacing, margin: next });

    return (
        <div className='flex flex-col h-full'>
            {/* Header */}
            <div className='px-4 py-4 border-b border-zinc-200 flex items-center justify-between'>
                <div>
                    <h2 className='text-base font-bold text-zinc-800'>
                        Layout 編輯
                    </h2>
                    <p className='text-xs text-zinc-500 mt-0.5'>
                        設定 Slot 與間距
                    </p>
                </div>
                <button
                    onClick={onDeselect}
                    className='text-zinc-400 hover:text-zinc-600 p-1 rounded'
                    aria-label='關閉編輯'
                >
                    <svg
                        width='14'
                        height='14'
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

            {/* Layout 資訊 */}
            <div className='px-4 py-3 border-b border-zinc-200'>
                <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${accentColor}`}
                >
                    <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}
                    >
                        {typeLabel}
                    </span>
                    <span className='text-sm font-medium truncate'>
                        {layout.label}
                    </span>
                </div>
            </div>

            {/* 捲動區 */}
            <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-4'>
                {/* ── Slots 手風琴 ── */}
                <div className='flex flex-col gap-2'>
                    <AccordionHeader
                        label='Slots'
                        count={layout.slots.length}
                        open={slotsOpen}
                        onToggle={() => setSlotsOpen(o => !o)}
                        action={
                            <button
                                onClick={() => onAddSlot(layout.id)}
                                className='flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors'
                            >
                                <svg
                                    width='12'
                                    height='12'
                                    viewBox='0 0 12 12'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                >
                                    <path d='M6 1v10M1 6h10' />
                                </svg>
                                新增
                            </button>
                        }
                    />

                    {slotsOpen && (
                        <div className='flex flex-col gap-1.5 mt-0.5'>
                            {layout.slots.length === 0 ? (
                                <div className='flex items-center justify-center h-16 rounded-lg border-2 border-dashed border-zinc-200 text-zinc-400 text-xs'>
                                    尚無 Slot
                                </div>
                            ) : (
                                layout.slots.map((slot, index) => (
                                    <div
                                        key={slot.id}
                                        className='flex items-center justify-between px-3 py-2 rounded-lg border border-zinc-200 bg-white'
                                    >
                                        <div className='flex items-center gap-2'>
                                            <span className='w-5 h-5 flex items-center justify-center rounded bg-zinc-100 text-zinc-500 text-xs font-bold shrink-0'>
                                                {index + 1}
                                            </span>
                                            <span className='text-xs text-zinc-400 font-mono'>
                                                {slot.id.slice(0, 8)}…
                                            </span>
                                            {slot.children.length > 0 && (
                                                <span className='text-xs text-zinc-400'>
                                                    ({slot.children.length})
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() =>
                                                onRemoveSlot(layout.id, slot.id)
                                            }
                                            disabled={slot.children.length > 0}
                                            className='text-zinc-300 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-0.5 rounded'
                                            title={
                                                slot.children.length > 0
                                                    ? '請先移除 Slot 內的 Layout'
                                                    : '移除此 Slot'
                                            }
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
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* 分隔線 */}
                <div className='border-t border-zinc-100' />

                {/* ── Grid 設定 手風琴（僅 grid layout 顯示） ── */}
                {layout.type === 'grid' &&
                    onUpdateGridDimensions &&
                    (() => {
                        const currentCols =
                            layout.gridConfig?.colWidths?.length ?? 2;
                        const currentRows =
                            layout.gridConfig?.rowHeights?.length ?? 2;

                        const applyNewCols = (newCols: number) => {
                            if (newCols < 1 || newCols > 12) return;
                            const newColWidths = Array.from(
                                { length: newCols },
                                () => 100 / newCols,
                            );
                            const newRows = Math.max(
                                1,
                                Math.ceil(layout.slots.length / newCols),
                            );
                            const existingRowHeights =
                                layout.gridConfig?.rowHeights ??
                                Array.from({ length: currentRows }, () => 120);
                            const newRowHeights = Array.from(
                                { length: newRows },
                                (_, i) => existingRowHeights[i] ?? 120,
                            );
                            onUpdateGridDimensions(
                                layout.id,
                                newColWidths,
                                newRowHeights,
                                layout.gridConfig?.colGap ?? null,
                                layout.gridConfig?.rowGap ?? null,
                            );
                        };

                        const applyGap = (colGap: number, rowGap: number) => {
                            onUpdateGridDimensions(
                                layout.id,
                                layout.gridConfig?.colWidths ??
                                    Array.from(
                                        { length: currentCols },
                                        () => 100 / currentCols,
                                    ),
                                layout.gridConfig?.rowHeights ??
                                    Array.from(
                                        { length: currentRows },
                                        () => 120,
                                    ),
                                colGap,
                                rowGap,
                            );
                        };

                        return (
                            <div className='flex flex-col gap-2'>
                                <AccordionHeader
                                    label='Grid 設定'
                                    open={gridOpen}
                                    onToggle={() => setGridOpen(o => !o)}
                                />
                                {gridOpen && (
                                    <div className='flex flex-col gap-3 mt-1'>
                                        {/* 每列欄數 */}
                                        <div>
                                            <p className='text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-2'>
                                                每列欄數
                                            </p>
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    onClick={() =>
                                                        applyNewCols(
                                                            currentCols - 1,
                                                        )
                                                    }
                                                    disabled={currentCols <= 1}
                                                    className='w-7 h-7 flex items-center justify-center rounded border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold'
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type='number'
                                                    min={1}
                                                    max={12}
                                                    value={currentCols}
                                                    onChange={e =>
                                                        applyNewCols(
                                                            parseInt(
                                                                e.target.value,
                                                                10,
                                                            ) || 1,
                                                        )
                                                    }
                                                    className='flex-1 text-center text-sm font-semibold border border-zinc-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition'
                                                />
                                                <button
                                                    onClick={() =>
                                                        applyNewCols(
                                                            currentCols + 1,
                                                        )
                                                    }
                                                    disabled={currentCols >= 12}
                                                    className='w-7 h-7 flex items-center justify-center rounded border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold'
                                                >
                                                    ＋
                                                </button>
                                            </div>
                                            <p className='text-[10px] text-zinc-400 mt-1.5'>
                                                目前 {currentCols} 欄 ×{' '}
                                                {currentRows} 列，共{' '}
                                                {layout.slots.length} 個 Slot
                                            </p>
                                        </div>

                                        {/* 欄間距 / 列間距 */}
                                        <div className='grid grid-cols-2 gap-2'>
                                            <div>
                                                <p className='text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5'>
                                                    欄間距 px
                                                </p>
                                                <input
                                                    type='number'
                                                    min={0}
                                                    max={200}
                                                    value={
                                                        layout.gridConfig
                                                            ?.colGap ?? 8
                                                    }
                                                    onChange={e =>
                                                        applyGap(
                                                            Math.max(
                                                                0,
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                    10,
                                                                ) || 0,
                                                            ),
                                                            layout.gridConfig
                                                                ?.rowGap ?? 8,
                                                        )
                                                    }
                                                    className='w-full text-center text-xs border border-zinc-200 rounded px-1 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition'
                                                />
                                            </div>
                                            <div>
                                                <p className='text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5'>
                                                    列間距 px
                                                </p>
                                                <input
                                                    type='number'
                                                    min={0}
                                                    max={200}
                                                    value={
                                                        layout.gridConfig
                                                            ?.rowGap ?? 8
                                                    }
                                                    onChange={e =>
                                                        applyGap(
                                                            layout.gridConfig
                                                                ?.colGap ?? 8,
                                                            Math.max(
                                                                0,
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                    10,
                                                                ) || 0,
                                                            ),
                                                        )
                                                    }
                                                    className='w-full text-center text-xs border border-zinc-200 rounded px-1 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                {/* 分隔線 */}
                <div className='border-t border-zinc-100' />

                {/* ── Flex 設定 手風琴（僅 flex layout 顯示） ── */}
                {layout.type === 'flex' &&
                    (onUpdateFlexGap || onUpdateFlexWrap) && (
                        <div className='flex flex-col gap-2'>
                            <AccordionHeader
                                label='Flex 設定'
                                open={flexOpen}
                                onToggle={() => setFlexOpen(o => !o)}
                            />
                            {flexOpen && (
                                <div className='flex flex-col gap-3 mt-1'>
                                    {onUpdateFlexGap && (
                                        <div>
                                            <p className='text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5'>
                                                欄間距 px
                                            </p>
                                            <input
                                                type='number'
                                                min={0}
                                                max={200}
                                                value={
                                                    layout.flexConfig?.gap ?? 8
                                                }
                                                onChange={e =>
                                                    onUpdateFlexGap(
                                                        layout.id,
                                                        Math.max(
                                                            0,
                                                            parseInt(
                                                                e.target.value,
                                                                10,
                                                            ) || 0,
                                                        ),
                                                    )
                                                }
                                                className='w-full text-center text-xs border border-zinc-200 rounded px-1 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition'
                                            />
                                        </div>
                                    )}
                                    {/* 列間距：只有換行開啟時才顯示 */}
                                    {onUpdateFlexRowGap &&
                                        (layout.flexConfig?.wrap ?? false) && (
                                            <div>
                                                <p className='text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5'>
                                                    列間距 px
                                                </p>
                                                <input
                                                    type='number'
                                                    min={0}
                                                    max={200}
                                                    value={
                                                        layout.flexConfig
                                                            ?.rowGap ?? 8
                                                    }
                                                    onChange={e =>
                                                        onUpdateFlexRowGap(
                                                            layout.id,
                                                            Math.max(
                                                                0,
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                    10,
                                                                ) || 0,
                                                            ),
                                                        )
                                                    }
                                                    className='w-full text-center text-xs border border-zinc-200 rounded px-1 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition'
                                                />
                                            </div>
                                        )}
                                    {onUpdateFlexWrap && (
                                        <div className='flex items-center justify-between'>
                                            <p className='text-[10px] font-semibold text-zinc-400 uppercase tracking-wide'>
                                                換行
                                            </p>
                                            <button
                                                onClick={() =>
                                                    onUpdateFlexWrap(
                                                        layout.id,
                                                        !(
                                                            layout.flexConfig
                                                                ?.wrap ?? false
                                                        ),
                                                    )
                                                }
                                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                                                    (layout.flexConfig?.wrap ??
                                                    false)
                                                        ? 'bg-sky-500'
                                                        : 'bg-zinc-200'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                                                        (layout.flexConfig
                                                            ?.wrap ?? false)
                                                            ? 'translate-x-4'
                                                            : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                {/* 分隔線 */}
                <div className='border-t border-zinc-100' />

                {/* ── 間距 手風琴 ── */}
                <div className='flex flex-col gap-2'>
                    <AccordionHeader
                        label='間距'
                        open={spacingOpen}
                        onToggle={() => setSpacingOpen(o => !o)}
                    />

                    {spacingOpen && (
                        <div className='flex flex-col gap-4 mt-1'>
                            <SpacingInput
                                label='Padding（內距）px'
                                value={spacing.padding}
                                onChange={updatePadding}
                            />
                            <SpacingInput
                                label='Margin（外距）px'
                                value={spacing.margin}
                                onChange={updateMargin}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

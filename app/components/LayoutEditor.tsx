'use client';

import type { NestedLayout } from './types';

export default function LayoutEditor({
    layout,
    onAddSlot,
    onRemoveSlot,
    onDeselect,
}: {
    layout: NestedLayout;
    onAddSlot: (layoutId: string) => void;
    onRemoveSlot: (layoutId: string, slotId: string) => void;
    onDeselect: () => void;
}) {
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

    return (
        <div className='flex flex-col h-full'>
            {/* Header */}
            <div className='px-4 py-4 border-b border-zinc-200 flex items-center justify-between'>
                <div>
                    <h2 className='text-base font-bold text-zinc-800'>
                        Layout 編輯
                    </h2>
                    <p className='text-xs text-zinc-500 mt-0.5'>
                        調整此 Layout 的 Slot 數量
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

            {/* Slot 列表 */}
            <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-3'>
                <div className='flex items-center justify-between mb-1'>
                    <span className='text-xs font-semibold text-zinc-500 uppercase tracking-wide'>
                        Slots（{layout.slots.length}）
                    </span>
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
                        新增 Slot
                    </button>
                </div>

                {layout.slots.length === 0 ? (
                    <div className='flex items-center justify-center h-20 rounded-lg border-2 border-dashed border-zinc-200 text-zinc-400 text-xs'>
                        尚無 Slot
                    </div>
                ) : (
                    layout.slots.map((slot, index) => (
                        <div
                            key={slot.id}
                            className='flex items-center justify-between px-3 py-2.5 rounded-lg border border-zinc-200 bg-white'
                        >
                            <div className='flex items-center gap-2'>
                                <span className='w-5 h-5 flex items-center justify-center rounded bg-zinc-100 text-zinc-500 text-xs font-bold shrink-0'>
                                    {index + 1}
                                </span>
                                <span className='text-xs text-zinc-500 font-mono truncate'>
                                    {slot.id.slice(0, 8)}…
                                </span>
                                {slot.children.length > 0 && (
                                    <span className='text-xs text-zinc-400'>
                                        ({slot.children.length} 項)
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => onRemoveSlot(layout.id, slot.id)}
                                disabled={slot.children.length > 0}
                                className='text-zinc-300 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-0.5 rounded'
                                aria-label='移除此 Slot'
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
        </div>
    );
}

'use client';

import { useState, type RefObject } from 'react';
import SlotZone from '@/components/editor/layout/SlotZone';
import ViewSlotZone from '@/components/view/ViewSlotZone';
import type { SlotProps } from '@/components/editor/layout/types';
import type { NestedLayout } from '@/types/layout';

type SharedCarouselLayoutProps = { layout: NestedLayout } & (
    | { mode: 'view' }
    | {
          mode: 'edit';
          containerRef: RefObject<HTMLDivElement | null>;
          sp: SlotProps;
          isDragging: boolean;
          depth: number;
      }
);

export default function BaseCarouselLayout(props: SharedCarouselLayoutProps) {
    const { layout } = props;
    const cfg = layout.carouselConfig ?? {
        visibleCount: 4,
        slideCount: 1,
        gap: 8,
    };
    const { visibleCount, slideCount, gap } = cfg;

    const totalSlots = layout.slots.length;
    const maxIndex = Math.max(
        0,
        Math.ceil((totalSlots - visibleCount) / slideCount),
    );
    const effectiveSlide = Math.min(Math.max(1, slideCount), visibleCount);
    const slotWidthPercent = 100 / visibleCount;

    const [currentIndex, setCurrentIndex] = useState(0);
    const clampedIndex = Math.min(currentIndex, maxIndex);

    // slot 數量 > visibleCount 時顯示箭頭
    const showArrows = totalSlots > visibleCount;

    const prev = () => setCurrentIndex(i => Math.max(0, i - 1));
    const next = () => setCurrentIndex(i => Math.min(maxIndex, i + 1));

    const slotStyle: React.CSSProperties = {
        minWidth: `calc(${slotWidthPercent}% - ${(gap * (visibleCount - 1)) / visibleCount}px)`,
        flexShrink: 0,
    };

    //  箭頭按鈕樣式
    const arrowBase =
        'absolute top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center ' +
        'rounded-full bg-white/90 shadow border border-zinc-200 ' +
        'text-zinc-600 hover:text-zinc-900 hover:bg-white ' +
        'disabled:opacity-30 disabled:cursor-not-allowed transition-all';

    const ArrowLeft = (
        <button
            onClick={prev}
            disabled={clampedIndex === 0}
            className={`${arrowBase} left-1`}
            aria-label='向左箭頭'
        >
            <svg
                width='14'
                height='14'
                viewBox='0 0 14 14'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            >
                <path d='M9 2L4 7l5 5' />
            </svg>
        </button>
    );

    const ArrowRight = (
        <button
            onClick={next}
            disabled={clampedIndex >= maxIndex}
            className={`${arrowBase} right-1`}
            aria-label='向右箭頭'
        >
            <svg
                width='14'
                height='14'
                viewBox='0 0 14 14'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            >
                <path d='M5 2l5 5-5 5' />
            </svg>
        </button>
    );

    //  translate X
    const translateX = `translateX(calc(-${clampedIndex * slotWidthPercent}% - ${(clampedIndex * gap) / visibleCount}px))`;

    //  View 模式
    if (props.mode === 'view') {
        return (
            <div className='relative w-full overflow-hidden'>
                {showArrows && ArrowLeft}
                <div
                    className='flex transition-transform duration-300 ease-in-out'
                    style={{ transform: translateX, gap: `${gap}px` }}
                >
                    {layout.slots.map(slot => (
                        <div key={slot.id} style={slotStyle}>
                            <ViewSlotZone slot={slot} />
                        </div>
                    ))}
                </div>
                {showArrows && ArrowRight}
            </div>
        );
    }

    //  Edit 模式
    return (
        <div ref={props.containerRef} className='relative w-full'>
            {/* 編輯 badge */}
            <div className='flex items-center gap-2 mb-2 px-1'>
                <span className='text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5'>
                    輪播-顯示 {visibleCount} 個，每次滑動 {slideCount} 個
                </span>
                <span className='text-[10px] text-zinc-400'>
                    {clampedIndex + 1} / {maxIndex + 1} 頁
                </span>
            </div>

            {/* 編輯模式 overflow-hidden 容器 */}
            <div className='relative overflow-hidden'>
                {showArrows && ArrowLeft}

                <div
                    className='flex transition-transform duration-300 ease-in-out'
                    style={{ transform: translateX, gap: `${gap}px` }}
                >
                    {layout.slots.map(slot => (
                        <div key={slot.id} style={slotStyle}>
                            <SlotZone
                                slot={slot}
                                {...props.sp}
                                isDragging={props.isDragging}
                                depth={props.depth}
                            />
                        </div>
                    ))}
                </div>

                {showArrows && ArrowRight}
            </div>
        </div>
    );
}

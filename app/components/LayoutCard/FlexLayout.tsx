'use client';

import { Fragment, type RefObject } from 'react';
import ResizeHandle from '../ResizeHandle';
import SlotZone from './SlotZone';
import type { NestedLayout } from '@/types/layout';
import type { SlotProps } from './types';

export default function FlexLayout({
    layout,
    containerRef,
    sp,
    onDrag,
    isDragging,
}: {
    layout: NestedLayout;
    containerRef: RefObject<HTMLDivElement | null>;
    sp: SlotProps;
    onDrag: (i: number, dx: number) => void;
    isDragging: boolean;
}) {
    const gap = layout.flexGap ?? 8;
    const rowGap = layout.flexRowGap ?? 8;
    const n = layout.slots.length;
    const isWrap = layout.flexWrap ?? false;

    return (
        <div
            ref={containerRef}
            className='flex flex-row'
            style={{
                flexWrap: isWrap ? 'wrap' : 'nowrap',
                // wrap 模式：column/row gap 都用 CSS 處理
                // nowrap 模式：column gap 由 ResizeHandle 寬度負責，不套 CSS gap
                ...(isWrap
                    ? { columnGap: `${gap}px`, rowGap: `${rowGap}px` }
                    : {}),
            }}
        >
            {layout.slots.map((slot, i) => {
                const basis = slot.flexBasis ?? 100 / n;
                // nowrap：扣掉 handle 總寬中屬於此 slot 的份額
                // wrap：basis 直接用 %，CSS gap 自動處理間距，slot 自然換行
                const offsetPx = isWrap ? 0 : (basis / 100) * (n - 1) * gap;
                return (
                    <Fragment key={slot.id}>
                        <div
                            className='min-w-fit'
                            style={{
                                flexBasis: `calc(${basis}% - ${offsetPx.toFixed(3)}px)`,
                                flexShrink: 0,
                                flexGrow: 0,
                            }}
                        >
                            <SlotZone
                                slot={slot}
                                {...sp}
                                isDragging={isDragging}
                            />
                        </div>
                        {/* wrap 模式：column gap 由 CSS gap 處理，不需 ResizeHandle */}
                        {!isWrap && i < n - 1 && (
                            <ResizeHandle
                                size={gap}
                                onDrag={dx => onDrag(i, dx)}
                            />
                        )}
                    </Fragment>
                );
            })}
        </div>
    );
}

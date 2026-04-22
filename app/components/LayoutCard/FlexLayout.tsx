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
    const n = layout.slots.length;

    return (
        <div ref={containerRef} className='flex flex-row'>
            {layout.slots.map((slot, i) => {
                const basis = slot.flexBasis ?? 100 / n;
                // 每個 slot 從自己的 % 比例中扣掉對應的 handle 寬度
                // totalHandleWidth = (n-1)*gap，slot 佔 basis/100 的比例
                const offsetPx = (basis / 100) * (n - 1) * gap;
                return (
                    <Fragment key={slot.id}>
                        <div
                            className='min-w-0'
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
                        {i < n - 1 && (
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

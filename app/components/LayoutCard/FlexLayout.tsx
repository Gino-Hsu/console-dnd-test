'use client';

import type { RefObject } from 'react';
import ResizeHandle from './ResizeHandle';
import SlotZone from './SlotZone';
import type { NestedLayout } from '@/types/layout';
import type { SlotProps } from './types';

export default function FlexLayout({
    layout,
    containerRef,
    sp,
    onDrag,
}: {
    layout: NestedLayout;
    containerRef: RefObject<HTMLDivElement | null>;
    sp: SlotProps;
    onDrag: (i: number, dx: number) => void;
}) {
    return (
        <div ref={containerRef} className='flex flex-row'>
            {layout.slots.map((slot, i) => (
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
                        <ResizeHandle onDrag={dx => onDrag(i, dx)} />
                    )}
                </div>
            ))}
        </div>
    );
}

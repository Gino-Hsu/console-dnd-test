'use client';

import SlotZone from './SlotZone';
import type { NestedLayout } from '@/types/layout';
import type { SlotProps } from './types';

export default function BlockLayout({
    slots,
    sp,
    isDragging,
}: {
    slots: NestedLayout['slots'];
    sp: SlotProps;
    isDragging: boolean;
}) {
    return (
        <div className='flex flex-col gap-2'>
            {slots.map(slot => (
                <SlotZone
                    key={slot.id}
                    slot={slot}
                    {...sp}
                    isDragging={isDragging}
                />
            ))}
        </div>
    );
}

'use client';

import SharedBlockLayout from '@/app/components/shared/SharedBlockLayout';
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
        <SharedBlockLayout
            mode='edit'
            slots={slots}
            sp={sp}
            isDragging={isDragging}
        />
    );
}

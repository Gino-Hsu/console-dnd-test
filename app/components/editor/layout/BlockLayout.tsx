'use client';

import SharedBlockLayout from '@/app/components/base/BaseBlockLayout';
import type { NestedLayout } from '@/types/layout';
import type { SlotProps } from './types';

export default function BlockLayout({
    slots,
    sp,
    isDragging,
    depth,
}: {
    slots: NestedLayout['slots'];
    sp: SlotProps;
    isDragging: boolean;
    depth: number;
}) {
    return (
        <SharedBlockLayout
            mode='edit'
            slots={slots}
            sp={sp}
            isDragging={isDragging}
            depth={depth}
        />
    );
}

'use client';

import type { RefObject } from 'react';
import SharedFlexLayout from '@/app/components/shared/SharedFlexLayout';
import type { NestedLayout } from '@/types/layout';
import type { SlotProps } from './types';

export default function FlexLayout({
    layout,
    containerRef,
    sp,
    onDrag,
    isDragging,
    depth,
}: {
    layout: NestedLayout;
    containerRef: RefObject<HTMLDivElement | null>;
    sp: SlotProps;
    onDrag: (i: number, dx: number) => void;
    isDragging: boolean;
    depth: number;
}) {
    return (
        <SharedFlexLayout
            mode='edit'
            layout={layout}
            containerRef={containerRef}
            sp={sp}
            onDrag={onDrag}
            isDragging={isDragging}
            depth={depth}
        />
    );
}

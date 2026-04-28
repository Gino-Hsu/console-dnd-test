'use client';

import type { RefObject } from 'react';
import SharedGridLayout from '@/app/components/shared/SharedGridLayout';
import type { NestedLayout } from '@/types/layout';
import type { SlotProps } from './types';

export default function GridLayout({
    layout,
    containerRef,
    cols,
    defColW,
    sp,
    onColDrag,
    isDragging,
}: {
    layout: NestedLayout;
    containerRef: RefObject<HTMLDivElement | null>;
    cols: number;
    defColW: number;
    sp: SlotProps;
    onColDrag: (i: number, dx: number) => void;
    isDragging: boolean;
}) {
    return (
        <SharedGridLayout
            mode='edit'
            layout={layout}
            cols={cols}
            defColW={defColW}
            containerRef={containerRef}
            sp={sp}
            onColDrag={onColDrag}
            isDragging={isDragging}
        />
    );
}

'use client';

import type { RefObject } from 'react';
import BlockLayout from './BlockLayout';
import FlexLayout from './FlexLayout';
import GridLayout from './GridLayout';
import type { NestedLayout } from '@/types/layout';
import type { SlotProps } from './types';

export default function LayoutContent({
    layout,
    flexRef,
    gridRef,
    cols,
    defColW,
    sp,
    onFlexDrag,
    onColDrag,
    isDragging,
}: {
    layout: NestedLayout;
    flexRef: RefObject<HTMLDivElement | null>;
    gridRef: RefObject<HTMLDivElement | null>;
    cols: number;
    defColW: number;
    sp: SlotProps;
    onFlexDrag: (i: number, dx: number) => void;
    onColDrag: (i: number, dx: number) => void;
    isDragging: boolean;
}) {
    if (layout.type === 'block') {
        return (
            <BlockLayout slots={layout.slots} isDragging={isDragging} sp={sp} />
        );
    }
    if (layout.type === 'flex') {
        return (
            <FlexLayout
                layout={layout}
                containerRef={flexRef}
                sp={sp}
                onDrag={onFlexDrag}
                isDragging={isDragging}
            />
        );
    }
    if (layout.type === 'grid') {
        return (
            <GridLayout
                layout={layout}
                containerRef={gridRef}
                cols={cols}
                defColW={defColW}
                sp={sp}
                onColDrag={onColDrag}
                isDragging={isDragging}
            />
        );
    }
    return null;
}

'use client';

import type { RefObject } from 'react';
import BlockLayout from './BlockLayout';
import FlexLayout from './FlexLayout';
import GridLayout from './GridLayout';
import CarouselLayout from './CarouselLayout';
import type { NestedLayout } from '@/types/layout';
import type { SlotProps } from './types';

export default function LayoutContent({
    layout,
    flexRef,
    gridRef,
    carouselRef,
    cols,
    defColW,
    sp,
    onFlexDrag,
    onColDrag,
    isDragging,
    depth,
}: {
    layout: NestedLayout;
    flexRef: RefObject<HTMLDivElement | null>;
    gridRef: RefObject<HTMLDivElement | null>;
    carouselRef: RefObject<HTMLDivElement | null>;
    cols: number;
    defColW: number;
    sp: SlotProps;
    onFlexDrag: (i: number, dx: number) => void;
    onColDrag: (i: number, dx: number) => void;
    isDragging: boolean;
    depth: number;
}) {
    if (layout.layoutType === 'block') {
        return (
            <BlockLayout
                slots={layout.slots}
                isDragging={isDragging}
                sp={sp}
                depth={depth}
            />
        );
    }
    if (layout.layoutType === 'flex') {
        return (
            <FlexLayout
                layout={layout}
                containerRef={flexRef}
                sp={sp}
                onDrag={onFlexDrag}
                isDragging={isDragging}
                depth={depth}
            />
        );
    }
    if (layout.layoutType === 'grid') {
        return (
            <GridLayout
                layout={layout}
                containerRef={gridRef}
                cols={cols}
                defColW={defColW}
                sp={sp}
                onColDrag={onColDrag}
                isDragging={isDragging}
                depth={depth}
            />
        );
    }
    if (layout.layoutType === 'carousel') {
        return (
            <CarouselLayout
                layout={layout}
                containerRef={carouselRef}
                sp={sp}
                isDragging={isDragging}
                depth={depth}
            />
        );
    }
    return null;
}

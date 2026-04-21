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
    rows,
    defColW,
    defRowH,
    sp,
    onFlexDrag,
    onColDrag,
    onRowDrag,
}: {
    layout: NestedLayout;
    flexRef: RefObject<HTMLDivElement | null>;
    gridRef: RefObject<HTMLDivElement | null>;
    cols: number;
    rows: number;
    defColW: number;
    defRowH: number;
    sp: SlotProps;
    onFlexDrag: (i: number, dx: number) => void;
    onColDrag: (i: number, dx: number) => void;
    onRowDrag: (i: number, dy: number) => void;
}) {
    if (!layout.slots.length) return null;

    if (layout.type === 'block') {
        return <BlockLayout slots={layout.slots} sp={sp} />;
    }
    if (layout.type === 'flex') {
        return (
            <FlexLayout
                layout={layout}
                containerRef={flexRef}
                sp={sp}
                onDrag={onFlexDrag}
            />
        );
    }
    return (
        <GridLayout
            layout={layout}
            containerRef={gridRef}
            cols={cols}
            rows={rows}
            defColW={defColW}
            defRowH={defRowH}
            sp={sp}
            onColDrag={onColDrag}
            onRowDrag={onRowDrag}
        />
    );
}

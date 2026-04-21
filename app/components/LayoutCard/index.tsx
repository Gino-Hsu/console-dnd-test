'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCallback, useRef } from 'react';
import {
    layoutTheme,
    resizeFlexSlots,
    resizeGridCols,
    // resizeGridRows,
} from '@/lib/layout/resizeUtils';
import LayoutContent from './LayoutContent';
import LayoutFrame from './LayoutFrame';
import LayoutHeader from './LayoutHeader';
import type { SharedProps } from './types';
import type { NestedLayout } from '@/types/layout';

export default function LayoutCard({
    layout,
    depth = 0,
    ...shared
}: SharedProps & { layout: NestedLayout; depth?: number }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: layout.id });

    const sortStyle: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    // ── refs ──────────────────────────────────────────────────────────────────
    const flexRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // ── grid 尺寸 ─────────────────────────────────────────────────────────────
    const cols = layout.gridColWidths?.length ?? 2;
    const rows = Math.max(1, Math.ceil(layout.slots.length / cols));
    const defColW = 100 / cols;
    const defRowH = 120;

    // ── resize handlers ───────────────────────────────────────────────────────
    const handleFlexDrag = useCallback(
        (i: number, dx: number) => {
            if (!flexRef.current || !shared.onUpdateSlotWidths) return;
            const tw = flexRef.current.offsetWidth;
            if (!tw) return;
            const gap = layout.flexGap ?? 8;
            const contentWidth = tw - (layout.slots.length - 1) * gap;
            if (!contentWidth) return;
            const eq = 100 / layout.slots.length;
            shared.onUpdateSlotWidths(
                layout.id,
                resizeFlexSlots(
                    layout.slots.map(s => s.flexBasis ?? eq),
                    i,
                    (dx / contentWidth) * 100,
                ),
            );
        },
        [layout, shared.onUpdateSlotWidths],
    );

    const handleColDrag = useCallback(
        (i: number, dx: number) => {
            if (!gridRef.current || !shared.onUpdateGridDimensions) return;
            const tw = gridRef.current.offsetWidth;
            if (!tw) return;
            const cw =
                layout.gridColWidths ??
                Array.from({ length: cols }, () => defColW);
            shared.onUpdateGridDimensions(
                layout.id,
                resizeGridCols(cw, i, (dx / tw) * 100),
                layout.gridRowHeights ??
                    Array.from({ length: rows }, () => defRowH),
                layout.gridColGap,
                layout.gridRowGap,
            );
        },
        [layout, cols, rows, defColW, defRowH, shared.onUpdateGridDimensions],
    );

    // const handleRowDrag = useCallback(
    //     (i: number, dy: number) => {
    //         if (!shared.onUpdateGridDimensions) return;
    //         const rh =
    //             layout.gridRowHeights ??
    //             Array.from({ length: rows }, () => defRowH);
    //         shared.onUpdateGridDimensions(
    //             layout.id,
    //             layout.gridColWidths ??
    //                 Array.from({ length: cols }, () => defColW),
    //             resizeGridRows(rh, i, dy),
    //             layout.gridColGap,
    //             layout.gridRowGap,
    //         );
    //     },
    //     [layout, cols, rows, defColW, defRowH, shared.onUpdateGridDimensions],
    // );

    // ── 外觀 ──────────────────────────────────────────────────────────────────
    const { borderColor, bgColor } = layoutTheme(layout.type, depth);
    const isSelected = shared.selectedLayoutId === layout.id;
    const sp = { ownerId: layout.id, ...shared };

    return (
        <LayoutFrame
            layout={layout}
            setNodeRef={setNodeRef}
            sortStyle={sortStyle}
            borderColor={borderColor}
            bgColor={bgColor}
            isSelected={isSelected}
        >
            <LayoutHeader
                layout={layout}
                listeners={listeners}
                attributes={attributes}
                onRemove={shared.onRemove}
                onSelect={shared.onSelect}
            />
            <LayoutContent
                layout={layout}
                flexRef={flexRef}
                gridRef={gridRef}
                cols={cols}
                // rows={rows}
                defColW={defColW}
                // defRowH={defRowH}
                sp={sp}
                onFlexDrag={handleFlexDrag}
                onColDrag={handleColDrag}
                // onRowDrag={handleRowDrag}
            />
        </LayoutFrame>
    );
}

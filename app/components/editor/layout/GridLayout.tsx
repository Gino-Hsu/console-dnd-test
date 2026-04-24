'use client';

import type { RefObject } from 'react';
import {
    gridColHandleLeft,
    gridContainerStyle,
    gridRowHandleTop,
} from '@/lib/layout/resizeUtils';
import ResizeHandle from '../ResizeHandle';
import SlotZone from './SlotZone';
import type { NestedLayout } from '@/types/layout';
import type { SlotProps } from './types';

export default function GridLayout({
    layout,
    containerRef,
    cols,
    // rows,
    defColW,
    // defRowH,
    sp,
    onColDrag,
    // onRowDrag,
    isDragging,
}: {
    layout: NestedLayout;
    containerRef: RefObject<HTMLDivElement | null>;
    cols: number;
    // rows: number;
    defColW: number;
    // defRowH: number;
    sp: SlotProps;
    onColDrag: (i: number, dx: number) => void;
    // onRowDrag: (i: number, dy: number) => void;
    isDragging: boolean;
}) {
    return (
        <div
            ref={containerRef}
            className='relative'
            style={gridContainerStyle(layout, cols, defColW)}
        >
            {layout.slots.map(slot => (
                <SlotZone
                    key={slot.id}
                    slot={slot}
                    isGridItem
                    {...sp}
                    isDragging={isDragging}
                />
            ))}

            {/* 欄分隔拖曳條 */}
            {Array.from({ length: cols - 1 }, (_, i) => {
                const cw =
                    layout.gridColWidths ??
                    Array.from({ length: cols }, () => defColW);
                return (
                    <div
                        key={`col-${i}`}
                        className='absolute top-0 bottom-0 z-20 flex items-stretch'
                        style={{
                            left: gridColHandleLeft(
                                cw,
                                i,
                                layout.gridColGap ?? 8,
                            ),
                            width: '8px',
                        }}
                    >
                        <ResizeHandle
                            direction='col'
                            onDrag={dx => onColDrag(i, dx)}
                        />
                    </div>
                );
            })}

            {/* 列分隔拖曳條 */}
            {/* {Array.from({ length: rows - 1 }, (_, i) => {
                const rh =
                    layout.gridRowHeights ??
                    Array.from({ length: rows }, () => defRowH);
                return (
                    <div
                        key={`row-${i}`}
                        className='absolute left-0 right-0 z-20 flex flex-col justify-stretch'
                        style={{
                            top: `calc(${gridRowHandleTop(rh, i, layout.gridRowGap ?? 8)}px - 4px)`,
                            height: '8px',
                        }}
                    >
                        <ResizeHandle
                            direction='row'
                            onDrag={dy => onRowDrag(i, dy)}
                        />
                    </div>
                );
            })} */}
        </div>
    );
}

'use client';

import type { RefObject } from 'react';
import {
    gridColHandleLeft,
    gridContainerStyle,
} from '@/lib/layout/resizeUtils';
import ResizeHandle from '@/app/components/editor/ResizeHandle';
import SlotZone from '@/app/components/editor/layout/SlotZone';
import ViewSlotZone from '@/app/components/view/ViewSlotZone';
import type { SlotProps } from '@/app/components/editor/layout/types';
import type { NestedLayout } from '@/types/layout';

type SharedGridLayoutProps = {
    layout: NestedLayout;
    cols: number;
    defColW: number;
} & (
    | { mode: 'view' }
    | {
          mode: 'edit';
          containerRef: RefObject<HTMLDivElement | null>;
          sp: SlotProps;
          onColDrag: (i: number, dx: number) => void;
          isDragging: boolean;
      }
);

export default function SharedGridLayout(props: SharedGridLayoutProps) {
    const { layout, cols, defColW } = props;

    return (
        <div
            ref={props.mode === 'edit' ? props.containerRef : undefined}
            className='relative'
            style={gridContainerStyle(layout, cols, defColW)}
        >
            {layout.slots.map(slot =>
                props.mode === 'edit' ? (
                    <SlotZone
                        key={slot.id}
                        slot={slot}
                        isGridItem
                        {...props.sp}
                        isDragging={props.isDragging}
                    />
                ) : (
                    <ViewSlotZone key={slot.id} slot={slot} isGridItem />
                ),
            )}

            {/* 欄分隔拖曳條：只在 edit mode 渲染 */}
            {props.mode === 'edit' &&
                Array.from({ length: cols - 1 }, (_, i) => {
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
                                onDrag={dx => props.onColDrag(i, dx)}
                            />
                        </div>
                    );
                })}
        </div>
    );
}

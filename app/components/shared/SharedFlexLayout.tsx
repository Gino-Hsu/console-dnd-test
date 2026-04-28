'use client';

import { Fragment, type RefObject } from 'react';
import ResizeHandle from '@/app/components/editor/ResizeHandle';
import SlotZone from '@/app/components/editor/layout/SlotZone';
import ViewSlotZone from '@/app/components/view/ViewSlotZone';
import type { SlotProps } from '@/app/components/editor/layout/types';
import type { NestedLayout } from '@/types/layout';

type SharedFlexLayoutProps = { layout: NestedLayout } & (
    | { mode: 'view' }
    | {
          mode: 'edit';
          containerRef: RefObject<HTMLDivElement | null>;
          sp: SlotProps;
          onDrag: (i: number, dx: number) => void;
          isDragging: boolean;
      }
);

export default function SharedFlexLayout(props: SharedFlexLayoutProps) {
    const { layout } = props;
    const gap = layout.flexGap ?? 8;
    const rowGap = layout.flexRowGap ?? 8;
    const n = layout.slots.length;
    const isWrap = layout.flexWrap ?? false;

    return (
        <div
            ref={props.mode === 'edit' ? props.containerRef : undefined}
            className='flex flex-row'
            style={{
                flexWrap: isWrap ? 'wrap' : 'nowrap',
                ...(isWrap
                    ? { columnGap: `${gap}px`, rowGap: `${rowGap}px` }
                    : {}),
            }}
        >
            {layout.slots.map((slot, i) => {
                const basis = slot.flexBasis ?? 100 / n;
                const offsetPx = isWrap ? 0 : (basis / 100) * (n - 1) * gap;
                return (
                    <Fragment key={slot.id}>
                        <div
                            className='min-w-fit'
                            style={{
                                flexBasis: `calc(${basis}% - ${offsetPx.toFixed(3)}px)`,
                                flexShrink: 0,
                                flexGrow: 0,
                            }}
                        >
                            {props.mode === 'edit' ? (
                                <SlotZone
                                    slot={slot}
                                    {...props.sp}
                                    isDragging={props.isDragging}
                                />
                            ) : (
                                <ViewSlotZone slot={slot} />
                            )}
                        </div>
                        {/* edit mode：ResizeHandle 作為間距；view mode：純 div 補間距 */}
                        {!isWrap && i < n - 1 && props.mode === 'edit' && (
                            <ResizeHandle
                                size={gap}
                                onDrag={dx => props.onDrag(i, dx)}
                            />
                        )}
                    </Fragment>
                );
            })}
        </div>
    );
}

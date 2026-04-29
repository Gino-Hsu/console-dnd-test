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
          depth: number;
      }
);

export default function SharedFlexLayout(props: SharedFlexLayoutProps) {
    const { layout } = props;
    const gap = layout.flexConfig?.gap ?? 8;
    const rowGap = layout.flexConfig?.rowGap ?? 8;
    const n = layout.slots.length;
    const isWrap = layout.flexConfig?.wrap ?? false;

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
                // ── wrap 模式：固定 px 寬度 + 右側拖曳把手 ─────────────────
                if (isWrap) {
                    const w = slot.flexWidthConfig.widthPx ?? 200;
                    return (
                        <div
                            key={slot.id}
                            className='relative h-fit'
                            style={{
                                width: `${w}px`,
                                flexShrink: 0,
                                flexGrow: 0,
                            }}
                        >
                            {props.mode === 'edit' ? (
                                <SlotZone
                                    slot={slot}
                                    {...props.sp}
                                    isDragging={props.isDragging}
                                    depth={props.depth}
                                />
                            ) : (
                                <ViewSlotZone slot={slot} />
                            )}
                            {/* 右側拖曳把手（僅 edit 模式） */}
                            {props.mode === 'edit' && (
                                <div
                                    className='absolute top-0 right-0 bottom-0 w-2 cursor-col-resize z-10
                                               flex items-center justify-center group'
                                    onPointerDown={e => {
                                        e.preventDefault();
                                        const startX = e.clientX;
                                        const startW = w;
                                        const el =
                                            e.currentTarget as HTMLDivElement;
                                        el.setPointerCapture(e.pointerId);
                                        const onMove = (mv: PointerEvent) => {
                                            const newW = Math.max(
                                                50,
                                                startW + mv.clientX - startX,
                                            );
                                            props.sp.onUpdateWrapSlotWidth?.(
                                                layout.id,
                                                slot.id,
                                                newW,
                                            );
                                        };
                                        const onUp = () => {
                                            window.removeEventListener(
                                                'pointermove',
                                                onMove,
                                            );
                                            window.removeEventListener(
                                                'pointerup',
                                                onUp,
                                            );
                                        };
                                        window.addEventListener(
                                            'pointermove',
                                            onMove,
                                        );
                                        window.addEventListener(
                                            'pointerup',
                                            onUp,
                                        );
                                    }}
                                >
                                    <div className='w-0.5 h-6 rounded-full bg-zinc-300 group-hover:bg-blue-400 transition-colors' />
                                </div>
                            )}
                        </div>
                    );
                }

                // ── 非 wrap 模式：% 寬度 + ResizeHandle ──────────────────────
                const basis = slot.flexWidthConfig.flexBasis ?? 100 / n;
                const offsetPx = (basis / 100) * (n - 1) * gap;
                return (
                    <Fragment key={slot.id}>
                        <div
                            className='min-w-0'
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
                                    depth={props.depth}
                                />
                            ) : (
                                <ViewSlotZone slot={slot} />
                            )}
                        </div>
                        {i < n - 1 && props.mode === 'edit' && (
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

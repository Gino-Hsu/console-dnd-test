import { gridContainerStyle, layoutTheme } from '@/lib/layout/resizeUtils';
import type { NestedLayout } from '@/types/layout';
import { Fragment } from 'react';
import ViewSlotZone from './ViewSlotZone';

export default function ViewLayoutCard({
    layout,
    depth = 0,
}: {
    layout: NestedLayout;
    depth?: number;
}) {
    const { borderColor, bgColor } = layoutTheme(layout.type, depth);
    const sp = layout.spacing;
    const mt = sp?.margin.top ?? 0,
        mr = sp?.margin.right ?? 0;
    const mb = sp?.margin.bottom ?? 0,
        ml = sp?.margin.left ?? 0;
    const pt = sp?.padding.top ?? 0,
        pr = sp?.padding.right ?? 0;
    const pb = sp?.padding.bottom ?? 0,
        pl = sp?.padding.left ?? 0;
    const hasMargin = mt + mr + mb + ml > 0;

    return (
        <div
            style={{
                paddingTop: mt,
                paddingRight: mr,
                paddingBottom: mb,
                paddingLeft: ml,
            }}
            className={` ${hasMargin ? 'bg-amber-100/60 outline-dashed outline-1 outline-amber-300' : ''}`}
        >
            <div
                className={`border-2 ${borderColor} ${bgColor}`}
                style={{
                    paddingTop: Math.max(pt),
                    paddingRight: Math.max(pr, 0),
                    paddingBottom: Math.max(pb, 0),
                    paddingLeft: Math.max(pl, 0),
                }}
            >
                <ViewLayoutContent layout={layout} depth={depth} />
            </div>
        </div>
    );
}

function ViewLayoutContent({
    layout,
    depth,
}: {
    layout: NestedLayout;
    depth: number;
}) {
    if (layout.type === 'block') {
        return (
            <div className='flex flex-col'>
                {layout.slots.map(slot => (
                    <ViewSlotZone key={slot.id} slot={slot} />
                ))}
            </div>
        );
    }

    if (layout.type === 'flex') {
        const gap = layout.flexGap ?? 0;
        const rowGap = layout.flexRowGap ?? 0;
        const n = layout.slots.length;
        const isWrap = layout.flexWrap ?? false;
        return (
            <div
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
                                className='min-w-0'
                                style={{
                                    flexBasis: `calc(${basis}% - ${offsetPx.toFixed(3)}px)`,
                                    flexShrink: 0,
                                    flexGrow: 0,
                                }}
                            >
                                <ViewSlotZone slot={slot} />
                            </div>
                            {/* nowrap 模式補間距用純 div，不需 ResizeHandle */}
                            {!isWrap && i < n - 1 && (
                                <div style={{ width: gap, flexShrink: 0 }} />
                            )}
                        </Fragment>
                    );
                })}
            </div>
        );
    }

    if (layout.type === 'grid') {
        const cols = layout.gridColWidths?.length ?? 2;
        const defColW = 100 / cols;
        return (
            <div
                className='relative'
                style={gridContainerStyle(layout, cols, defColW)}
            >
                {layout.slots.map(slot => (
                    <ViewSlotZone key={slot.id} slot={slot} />
                ))}
            </div>
        );
    }

    return null;
}

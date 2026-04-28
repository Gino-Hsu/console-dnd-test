import { layoutTheme } from '@/lib/layout/resizeUtils';
import type { NestedLayout } from '@/types/layout';
import SharedBlockLayout from '@/app/components/shared/SharedBlockLayout';
import SharedFlexLayout from '@/app/components/shared/SharedFlexLayout';
import SharedGridLayout from '@/app/components/shared/SharedGridLayout';

const MAX_LAYOUT_DEPTH = 2; // 允許 depth 0, 1, 2 (共3層)

export default function ViewLayoutCard({
    layout,
}: {
    layout: NestedLayout;
    depth?: number;
}) {
    const { borderColor, bgColor } = layoutTheme(layout.type);
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
                <ViewLayoutContent layout={layout} />
            </div>
        </div>
    );
}

function ViewLayoutContent({
    layout,
}: {
    layout: NestedLayout;
    depth: number;
}) {
    if (layout.type === 'block') {
        return <SharedBlockLayout mode='view' slots={layout.slots} />;
    }

    if (layout.type === 'flex') {
        return <SharedFlexLayout mode='view' layout={layout} />;
    }

    if (layout.type === 'grid') {
        const cols = layout.gridColWidths?.length ?? 2;
        const defColW = 100 / cols;
        return (
            <SharedGridLayout
                mode='view'
                layout={layout}
                cols={cols}
                defColW={defColW}
            />
        );
    }

    return null;
}

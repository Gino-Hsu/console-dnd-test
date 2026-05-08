import { layoutTheme } from '@/lib/layout/resizeUtils';
import type { NestedLayout } from '@/types/layout';
import SharedBlockLayout from '@/app/components/base/BaseBlockLayout';
import SharedFlexLayout from '@/app/components/base/BaseFlexLayout';
import SharedGridLayout from '@/app/components/base/BaseGridLayout';

export default function ViewLayoutCard({
    layout,
    depth = 0,
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

    const isRoot = depth === 0;
    const isContained =
        isRoot && (layout.containerWidth ?? 'full') === 'contained';

    return (
        <div className={isContained ? 'max-w-300 mx-auto w-full' : 'w-full'}>
            <div
                style={{
                    paddingTop: mt,
                    paddingRight: mr,
                    paddingBottom: mb,
                    paddingLeft: ml,
                }}
                className='w-full'
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
        </div>
    );
}

function ViewLayoutContent({ layout }: { layout: NestedLayout }) {
    if (layout.type === 'block') {
        return <SharedBlockLayout mode='view' slots={layout.slots} />;
    }

    if (layout.type === 'flex') {
        return <SharedFlexLayout mode='view' layout={layout} />;
    }

    if (layout.type === 'grid') {
        const cols = layout.gridConfig?.colWidths?.length ?? 2;
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

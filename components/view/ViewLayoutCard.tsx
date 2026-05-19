import { layoutTheme } from '@/lib/layout/resizeUtils';
import type { NestedLayout } from '@/types/layout';
import BaseLayoutFrame from '@/components/base/BaseLayoutFrame';
import SharedBlockLayout from '@/components/base/BaseBlockLayout';
import SharedFlexLayout from '@/components/base/BaseFlexLayout';
import SharedGridLayout from '@/components/base/BaseGridLayout';
import BaseCarouselLayout from '@/components/base/BaseCarouselLayout';

export default function ViewLayoutCard({
    layout,
    depth = 0,
}: {
    layout: NestedLayout;
    depth?: number;
}) {
    const { borderColor, bgColor } = layoutTheme(layout.layoutType);

    return (
        <BaseLayoutFrame
            layout={layout}
            depth={depth}
            outerClassName='w-full'
            innerClassName={`border-2 ${borderColor} ${bgColor}`}
        >
            <ViewLayoutContent layout={layout} />
        </BaseLayoutFrame>
    );
}

function ViewLayoutContent({ layout }: { layout: NestedLayout }) {
    if (layout.layoutType === 'block') {
        return <SharedBlockLayout mode='view' slots={layout.slots} />;
    }

    if (layout.layoutType === 'flex') {
        return <SharedFlexLayout mode='view' layout={layout} />;
    }

    if (layout.layoutType === 'grid') {
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

    if (layout.layoutType === 'carousel') {
        return <BaseCarouselLayout mode='view' layout={layout} />;
    }

    return null;
}

import type { NestedLayout } from '@/types/layout';
import { isLayoutNode } from '@/types/layout';
import ViewLayoutCard from './ViewLayoutCard';

export default function ViewSlotZone({
    slot,
    flexBasis,
    isGridItem,
}: {
    slot: NestedLayout['slots'][number];
    flexBasis?: number;
    depth?: number;
    isGridItem?: boolean;
}) {
    return (
        <div
            className={[
                flexBasis !== undefined ? 'min-w-0' : 'flex-1 min-w-0',
                isGridItem ? 'h-full' : undefined,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <div
                className={['rounded-lg flex flex-col gap-2 min-h-16']
                    .filter(Boolean)
                    .join(' ')}
            >
                {slot.children.map(child => {
                    // 目前只渲染 Layout，Component 未來實作
                    if (isLayoutNode(child)) {
                        return <ViewLayoutCard key={child.id} layout={child} />;
                    }
                    // TODO: 實作 ViewComponentCard
                    return null;
                })}
            </div>
        </div>
    );
}

import { cn } from '@/lib/cn';
import type { NestedLayout } from '@/types/layout';
import { isLayoutNode, isComponentNode, ALIGN_CLASS } from '@/types/layout';
import ViewLayoutCard from './ViewLayoutCard';
import ViewComponentCard from './ViewComponentCard';

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
    const alignClass = ALIGN_CLASS[slot.align ?? 'left'];

    return (
        <div
            className={cn(
                flexBasis !== undefined ? 'min-w-0' : 'flex-1 min-w-0',
                isGridItem ? 'h-full' : undefined,
            )}
        >
            <div
                className={cn(
                    'rounded-lg flex flex-col gap-2 min-h-16',
                    alignClass,
                )}
            >
                {slot.children.map(child => {
                    if (isLayoutNode(child)) {
                        return <ViewLayoutCard key={child.id} layout={child} />;
                    }
                    if (isComponentNode(child)) {
                        return (
                            <ViewComponentCard
                                key={child.id}
                                component={child}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
}

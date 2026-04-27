import type { NestedLayout } from '@/types/layout';
import ViewLayoutCard from './ViewLayoutCard';

export default function ViewSlotZone({
    slot,
    flexBasis,
    depth = 0,
}: {
    slot: NestedLayout['slots'][number];
    flexBasis?: number;
    depth?: number;
}) {
    return (
        <div
            className={[flexBasis !== undefined ? 'min-w-0' : 'flex-1 min-w-0']
                .filter(Boolean)
                .join(' ')}
            style={
                flexBasis !== undefined
                    ? { flexBasis: `${flexBasis}%`, flexShrink: 0, flexGrow: 0 }
                    : undefined
            }
        >
            <div
                className={['rounded-lg flex flex-col gap-2 min-h-16']
                    .filter(Boolean)
                    .join(' ')}
            >
                {slot.children.map(child => (
                    <ViewLayoutCard key={child.id} layout={child} depth={depth + 1} />
                ))}
            </div>
        </div>
    );
}

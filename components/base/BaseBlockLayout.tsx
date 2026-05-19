import SlotZone from '@/components/editor/layout/SlotZone';
import ViewSlotZone from '@/components/view/ViewSlotZone';
import type { SlotProps } from '@/components/editor/layout/types';
import type { NestedLayout } from '@/types/layout';

type SharedBlockLayoutProps = { slots: NestedLayout['slots'] } & (
    | { mode: 'view' }
    | { mode: 'edit'; sp: SlotProps; isDragging: boolean; depth: number }
);

export default function SharedBlockLayout(props: SharedBlockLayoutProps) {
    return (
        <div className='blockLayout flex flex-col gap-2 h-fit w-full'>
            {props.slots.map(slot =>
                props.mode === 'edit' ? (
                    <SlotZone
                        key={slot.id}
                        slot={slot}
                        {...props.sp}
                        isDragging={props.isDragging}
                        depth={props.depth}
                    />
                ) : (
                    <ViewSlotZone key={slot.id} slot={slot} />
                ),
            )}
        </div>
    );
}

export * from '@/types/layout';
export * from '@/lib/layout/graphUtils';

export interface SharedProps {
    onRemove: (id: string) => void;
    onSelect: (id: string) => void;
    selectedLayoutId: string | null;
    insertSlotId: string | null;
    slotInsertIndex: number | null;
    /** canvas 拖曳進行中（非 sidebar）時為 true，凍結所有 sortable dodge transform */
    isSomethingDragging?: boolean;
    onUpdateSlotWidths?: (layoutId: string, widths: number[]) => void;
    onUpdateGridDimensions?: (
        layoutId: string,
        colWidths: number[],
        rowHeights: number[],
        colGap: number | null,
        rowGap: number | null,
    ) => void;
}

/** SharedProps + ownerId，傳給 SlotZone */
export interface SlotProps extends SharedProps {
    ownerId: string;
}

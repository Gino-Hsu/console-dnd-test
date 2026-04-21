export interface SharedProps {
    onRemove: (id: string) => void;
    onSelect: (id: string) => void;
    selectedLayoutId: string | null;
    insertSlotId: string | null;
    slotInsertIndex: number | null;
    onUpdateSlotWidths?: (layoutId: string, widths: number[]) => void;
    onUpdateGridDimensions?: (
        layoutId: string,
        colWidths: number[],
        rowHeights: number[],
        colGap?: number,
        rowGap?: number,
    ) => void;
}

/** SharedProps + ownerId，傳給 SlotZone */
export interface SlotProps extends SharedProps {
    ownerId: string;
}

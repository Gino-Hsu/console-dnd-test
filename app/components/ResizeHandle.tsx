'use client';

import { useCallback, useRef } from 'react';

interface ResizeHandleProps {
    /** Called on each pointer-move tick with the raw pixel delta */
    onDrag: (dx: number) => void;
}

/**
 * 垂直分隔拖曳條，放在 flex layout 兩個 SlotZone 之間。
 * 使用 Pointer Capture 確保拖曳超出元素仍可追蹤。
 */
export default function ResizeHandle({ onDrag }: ResizeHandleProps) {
    const dragging = useRef(false);
    const lastX = useRef(0);

    const handlePointerDown = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            e.preventDefault();
            dragging.current = true;
            lastX.current = e.clientX;
            (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        },
        [],
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (!dragging.current) return;
            const dx = e.clientX - lastX.current;
            lastX.current = e.clientX;
            if (dx !== 0) onDrag(dx);
        },
        [onDrag],
    );

    const handlePointerUp = useCallback(() => {
        dragging.current = false;
    }, []);

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className='shrink-0 w-3 cursor-col-resize flex items-stretch justify-center group select-none'
            role='separator'
            aria-orientation='vertical'
            title='拖曳調整寬度'
        >
            {/* 視覺分隔線，hover / active 時加亮 */}
            <div className='w-0.5 rounded-full bg-zinc-200 group-hover:bg-blue-400 group-active:bg-blue-500 transition-colors my-1' />
        </div>
    );
}

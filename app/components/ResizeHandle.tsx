'use client';

import { useCallback, useRef } from 'react';

interface ResizeHandleProps {
    /**
     * 拖曳方向：
     * - `'col'`：垂直分隔條，左右拖曳（cursor-col-resize，追蹤 clientX）
     * - `'row'`：水平分隔條，上下拖曳（cursor-row-resize，追蹤 clientY）
     * @default 'col'
     */
    direction?: 'col' | 'row';
    /** 每次 pointermove 觸發，delta 為像素位移（col = dx, row = dy） */
    onDrag: (delta: number) => void;
}

/**
 * 分隔拖曳條，支援垂直（欄）與水平（列）兩種方向。
 * 使用 Pointer Capture 確保拖曳超出元素邊界仍可持續追蹤。
 */
export default function ResizeHandle({
    direction = 'col',
    onDrag,
}: ResizeHandleProps) {
    const dragging = useRef(false);
    const lastPos = useRef(0);

    const handlePointerDown = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            e.preventDefault();
            dragging.current = true;
            lastPos.current = direction === 'col' ? e.clientX : e.clientY;
            (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        },
        [direction],
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (!dragging.current) return;
            const current = direction === 'col' ? e.clientX : e.clientY;
            const delta = current - lastPos.current;
            lastPos.current = current;
            if (delta !== 0) onDrag(delta);
        },
        [direction, onDrag],
    );

    const handlePointerUp = useCallback(() => {
        dragging.current = false;
    }, []);

    const isCol = direction === 'col';

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={
                isCol
                    ? 'shrink-0 w-2 cursor-col-resize flex items-stretch justify-center group select-none'
                    : 'shrink-0 h-2 cursor-row-resize flex items-center justify-stretch group select-none'
            }
            role='separator'
            aria-orientation={isCol ? 'vertical' : 'horizontal'}
            title={isCol ? '拖曳調整欄寬' : '拖曳調整列高'}
        >
            <div
                className={
                    isCol
                        ? 'w-0.5 rounded-full bg-zinc-200 group-hover:bg-blue-400 group-active:bg-blue-500 transition-colors my-1'
                        : 'h-0.5 w-full rounded-full bg-zinc-200 group-hover:bg-blue-400 group-active:bg-blue-500 transition-colors mx-1'
                }
            />
        </div>
    );
}

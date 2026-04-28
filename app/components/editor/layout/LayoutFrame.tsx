'use client';

import type { CSSProperties, ReactNode } from 'react';
import type { NestedLayout } from '@/types/layout';

export default function LayoutFrame({
    layout,
    setNodeRef,
    sortStyle,
    borderColor,
    bgColor,
    isSelected,
    children,
}: {
    layout: NestedLayout;
    setNodeRef: (node: HTMLElement | null) => void;
    sortStyle: CSSProperties;
    borderColor: string;
    bgColor: string;
    isSelected: boolean;
    children: ReactNode;
}) {
    const sp = layout.spacing;
    const mt = sp?.margin.top ?? 0,
        mr = sp?.margin.right ?? 0;
    const mb = sp?.margin.bottom ?? 0,
        ml = sp?.margin.left ?? 0;
    const pt = sp?.padding.top ?? 0,
        pr = sp?.padding.right ?? 0;
    const pb = sp?.padding.bottom ?? 0,
        pl = sp?.padding.left ?? 0;
    const hasMargin = mt + mr + mb + ml > 0;
    const hasPadding = pt + pr + pb + pl > 0;

    return (
        /* margin 視覺層 */
        <div
            style={{
                paddingTop: mt,
                paddingRight: mr,
                paddingBottom: mb,
                paddingLeft: ml,
            }}
            className={`group rounded-xl transition-colors ${hasMargin ? 'group-hover:bg-amber-100/60 group-hover:outline-dashed group-hover:outline-1 group-hover:outline-amber-300' : ''}`}
        >
            {/* 卡片主體 */}
            <div
                ref={setNodeRef}
                style={sortStyle}
                className={`group relative rounded-lg border-2 transition-colors ${borderColor} ${bgColor} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
            >
                {/* padding 視覺色塊 */}
                {hasPadding && (
                    <>
                        {pt > 0 && (
                            <div
                                className='absolute inset-x-0 top-0 bg-green-200/60 pointer-events-none z-10 rounded-t-lg opacity-0 group-hover:opacity-100'
                                style={{ height: pt }}
                            />
                        )}
                        {pb > 0 && (
                            <div
                                className='absolute inset-x-0 bottom-0 bg-green-200/60 pointer-events-none z-10 rounded-b-lg opacity-0 group-hover:opacity-100'
                                style={{ height: pb }}
                            />
                        )}
                        {pl > 0 && (
                            <div
                                className='absolute inset-y-0 left-0 bg-green-200/60 pointer-events-none z-10 opacity-0 group-hover:opacity-100'
                                style={{ width: pl }}
                            />
                        )}
                        {pr > 0 && (
                            <div
                                className='absolute inset-y-0 right-0 bg-green-200/60 pointer-events-none z-10 opacity-0 group-hover:opacity-100'
                                style={{ width: pr }}
                            />
                        )}
                    </>
                )}

                {/* 內容（padding 保底 12px） */}
                <div
                    style={{
                        paddingTop: Math.max(pt, 12),
                        paddingRight: Math.max(pr, 12),
                        paddingBottom: Math.max(pb, 12),
                        paddingLeft: Math.max(pl, 12),
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

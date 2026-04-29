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
            className={`rounded-xl transition-colors ${hasMargin ? '[&:has(>_.card:hover)]:bg-amber-100/70 [&:has(>_.card:hover)]:outline-dashed [&:has(>_.card:hover)]:outline-1 [&:has(>_.card:hover)]:outline-amber-300 [&:has(>_.card:hover)>div>.padding-layer]:opacity-100' : ''}`}
        >
            {/* 卡片主體 */}
            <div
                ref={setNodeRef}
                style={sortStyle}
                className={`card relative rounded-lg border-2 transition-colors ${borderColor} ${bgColor} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
            >
                {/* padding 視覺色塊 */}
                {hasPadding && (
                    <>
                        {pt > 0 && (
                            <div
                                className='padding-layer absolute inset-x-0 top-0 bg-green-200/60 pointer-events-none z-10 rounded-t-lg opacity-0 transition-opacity'
                                style={{ height: pt }}
                            />
                        )}
                        {pb > 0 && (
                            <div
                                className='padding-layer absolute inset-x-0 bottom-0 bg-green-200/60 pointer-events-none z-10 rounded-b-lg opacity-0 transition-opacity'
                                style={{ height: pb }}
                            />
                        )}
                        {pl > 0 && (
                            <div
                                className='padding-layer absolute inset-y-0 left-0 bg-green-200/60 pointer-events-none z-10 opacity-0 transition-opacity'
                                style={{ width: pl }}
                            />
                        )}
                        {pr > 0 && (
                            <div
                                className='padding-layer absolute inset-y-0 right-0 bg-green-200/60 pointer-events-none z-10 opacity-0 transition-opacity'
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

'use client';

import type { RefObject } from 'react';
import BaseCarouselLayout from '@/components/base/BaseCarouselLayout';
import type { NestedLayout } from '@/types/layout';
import type { SlotProps } from './types';

export default function CarouselLayout({
    layout,
    containerRef,
    sp,
    isDragging,
    depth,
}: {
    layout: NestedLayout;
    containerRef: RefObject<HTMLDivElement | null>;
    sp: SlotProps;
    isDragging: boolean;
    depth: number;
}) {
    return (
        <BaseCarouselLayout
            mode='edit'
            layout={layout}
            containerRef={containerRef}
            sp={sp}
            isDragging={isDragging}
            depth={depth}
        />
    );
}

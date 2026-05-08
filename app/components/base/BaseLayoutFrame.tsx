import type { ReactNode, CSSProperties } from 'react';
import type { NestedLayout } from '@/types/layout';
import { getSpacing } from '@/lib/layout/resizeUtils';

export default function BaseLayoutFrame({
    layout,
    depth = 0,
    outerClassName,
    innerClassName,
    innerStyle,
    children,
}: {
    layout: NestedLayout;
    depth?: number;
    outerClassName?: string;
    innerClassName?: string;
    innerStyle?: CSSProperties;
    children: ReactNode;
}) {
    const { mt, mr, mb, ml, pt, pr, pb, pl } = getSpacing(layout);

    const isRoot = depth === 0;

    const isContained =
        isRoot && (layout.containerWidth ?? 'full') === 'contained';

    return (
        <div className={isContained ? 'max-w-300 mx-auto w-full' : 'w-full'}>
            {/* margin */}
            <div
                className={outerClassName}
                style={{
                    paddingTop: mt,
                    paddingRight: mr,
                    paddingBottom: mb,
                    paddingLeft: ml,
                }}
            >
                {/* actual card */}
                <div
                    className={innerClassName}
                    style={{
                        paddingTop: pt,
                        paddingRight: pr,
                        paddingBottom: pb,
                        paddingLeft: pl,
                        ...innerStyle,
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

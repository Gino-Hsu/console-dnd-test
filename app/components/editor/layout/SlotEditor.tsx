'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { SlotAlign } from '@/types/layout';
import { cn } from '@/lib/cn';

interface SlotEditorProps {
    anchorRef: React.RefObject<HTMLButtonElement | null>;
    currentAlign: SlotAlign | undefined;
    onUpdate: (align: SlotAlign) => void;
    onClose: () => void;
}

const ALIGNS: { value: SlotAlign; label: string; icon: React.ReactNode }[] = [
    {
        value: 'left',
        label: '靠左',
        icon: (
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <rect
                    x='2'
                    y='3'
                    width='9'
                    height='2'
                    rx='1'
                    fill='currentColor'
                />
                <rect
                    x='2'
                    y='7'
                    width='12'
                    height='2'
                    rx='1'
                    fill='currentColor'
                />
                <rect
                    x='2'
                    y='11'
                    width='7'
                    height='2'
                    rx='1'
                    fill='currentColor'
                />
            </svg>
        ),
    },
    {
        value: 'center',
        label: '置中',
        icon: (
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <rect
                    x='3.5'
                    y='3'
                    width='9'
                    height='2'
                    rx='1'
                    fill='currentColor'
                />
                <rect
                    x='2'
                    y='7'
                    width='12'
                    height='2'
                    rx='1'
                    fill='currentColor'
                />
                <rect
                    x='4.5'
                    y='11'
                    width='7'
                    height='2'
                    rx='1'
                    fill='currentColor'
                />
            </svg>
        ),
    },
    {
        value: 'right',
        label: '靠右',
        icon: (
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <rect
                    x='5'
                    y='3'
                    width='9'
                    height='2'
                    rx='1'
                    fill='currentColor'
                />
                <rect
                    x='2'
                    y='7'
                    width='12'
                    height='2'
                    rx='1'
                    fill='currentColor'
                />
                <rect
                    x='7'
                    y='11'
                    width='7'
                    height='2'
                    rx='1'
                    fill='currentColor'
                />
            </svg>
        ),
    },
];

export default function SlotEditor({
    anchorRef,
    currentAlign,
    onUpdate,
    onClose,
}: SlotEditorProps) {
    const active = currentAlign ?? 'left';
    const popoverRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState<{ top: number; right: number } | null>(null);

    useLayoutEffect(() => {
        if (!anchorRef.current) return;
        const rect = anchorRef.current.getBoundingClientRect();
        setPos({
            top: rect.bottom + 4,
            right: window.innerWidth - rect.right,
        });
    }, [anchorRef]);

    if (!pos) return null;

    return createPortal(
        <>
            {/* backdrop */}
            <div className='fixed inset-0 z-40' onClick={onClose} />
            {/* popover */}
            <div
                ref={popoverRef}
                className='fixed z-50 bg-white border border-zinc-200 rounded-lg shadow-lg p-2 flex flex-col gap-1 min-w-27.5'
                style={{ top: pos.top, right: pos.right }}
                onPointerDown={e => e.stopPropagation()}
            >
                <div className='text-[10px] font-semibold text-zinc-400 px-1 pb-1 select-none'>
                    對齊方式
                </div>
                {ALIGNS.map(({ value, label, icon }) => (
                    <button
                        key={value}
                        onClick={() => {
                            onUpdate(value);
                            onClose();
                        }}
                        className={cn(
                            'flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors w-full text-left',
                            active === value
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-zinc-600 hover:bg-zinc-50',
                        )}
                    >
                        {icon}
                        {label}
                    </button>
                ))}
            </div>
        </>,
        document.body,
    );
}

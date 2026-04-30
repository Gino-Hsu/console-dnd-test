'use client';

import { useState } from 'react';
import type { ComponentNode } from '@/types/layout';
import {
    TextField,
    NumberField,
    SelectField,
    CheckboxField,
    ColorField,
} from './common/FormFields';

/* ── 小工具：手風琴 header ─────────────────────────── */
function AccordionHeader({
    label,
    open,
    onToggle,
}: {
    label: string;
    open: boolean;
    onToggle: () => void;
}) {
    return (
        <button
            onClick={onToggle}
            className='flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide hover:text-zinc-700 transition-colors w-full'
        >
            <svg
                width='10'
                height='10'
                viewBox='0 0 10 10'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                className={`transition-transform ${open ? 'rotate-90' : ''}`}
            >
                <path d='M3 2l4 3-4 3' />
            </svg>
            {label}
        </button>
    );
}

export default function ComponentEditor({
    component,
    onUpdateData,
    onUpdateStyle,
    onDeselect,
}: {
    component: ComponentNode;
    onUpdateData: (componentId: string, data: Record<string, unknown>) => void;
    onUpdateStyle: (componentId: string, style: Record<string, unknown>) => void;
    onDeselect: () => void;
}) {
    const [dataOpen, setDataOpen] = useState(true);
    const [styleOpen, setStyleOpen] = useState(true);

    // 根據 componentId 決定要顯示哪些欄位
    const renderDataFields = () => {
        const data = component.data;

        switch (component.componentId) {
            case 'H01': // heading-simple
            case 'H02': // heading-divided
                return (
                    <div className='space-y-3'>
                        <TextField
                            label='標題'
                            value={(data.title as string) || ''}
                            onChange={value =>
                                onUpdateData(component.id, { ...data, title: value })
                            }
                        />

                        <SelectField
                            label='層級'
                            value={(data.level as string) || 'h2'}
                            onChange={value =>
                                onUpdateData(component.id, { ...data, level: value })
                            }
                            options={[
                                { value: 'h1', label: 'H1' },
                                { value: 'h2', label: 'H2' },
                                { value: 'h3', label: 'H3' },
                                { value: 'h4', label: 'H4' },
                                { value: 'h5', label: 'H5' },
                                { value: 'h6', label: 'H6' },
                            ]}
                        />

                        {/* heading-divided 特有：說明文字 */}
                        {component.componentId === 'H02' && (
                            <TextField
                                label='說明文字'
                                value={(data.description as string) || ''}
                                onChange={value =>
                                    onUpdateData(component.id, {
                                        ...data,
                                        description: value,
                                    })
                                }
                            />
                        )}
                    </div>
                );

            case 'I01': // image-simple
                return (
                    <div className='space-y-3'>
                        <TextField
                            label='圖片 URL'
                            value={(data.src as string) || ''}
                            onChange={value =>
                                onUpdateData(component.id, { ...data, src: value })
                            }
                        />

                        <TextField
                            label='替代文字'
                            value={(data.alt as string) || ''}
                            onChange={value =>
                                onUpdateData(component.id, { ...data, alt: value })
                            }
                        />
                    </div>
                );

            default:
                return <div className='text-xs text-zinc-400'>無可編輯欄位</div>;
        }
    };

    const renderStyleFields = () => {
        const style = component.style;

        switch (component.componentId) {
            case 'H01': // heading-simple
                return (
                    <div className='space-y-3'>
                        <SelectField
                            label='對齊方式'
                            value={(style.align as string) || 'left'}
                            onChange={value =>
                                onUpdateStyle(component.id, { ...style, align: value })
                            }
                            options={[
                                { value: 'left', label: '靠左' },
                                { value: 'center', label: '置中' },
                                { value: 'right', label: '靠右' },
                            ]}
                        />

                        <ColorField
                            label='顏色'
                            value={(style.color as string) || '#000000'}
                            onChange={value =>
                                onUpdateStyle(component.id, { ...style, color: value })
                            }
                        />

                        <NumberField
                            label='字體大小 (px)'
                            value={(style.fontSize as number) || 24}
                            onChange={value =>
                                onUpdateStyle(component.id, {
                                    ...style,
                                    fontSize: value,
                                })
                            }
                            min={8}
                            max={120}
                        />

                        <SelectField
                            label='字重'
                            value={(style.fontWeight as string) || 'normal'}
                            onChange={value =>
                                onUpdateStyle(component.id, {
                                    ...style,
                                    fontWeight: value,
                                })
                            }
                            options={[
                                { value: 'normal', label: 'Normal' },
                                { value: 'bold', label: 'Bold' },
                                { value: '100', label: '100' },
                                { value: '200', label: '200' },
                                { value: '300', label: '300' },
                                { value: '400', label: '400' },
                                { value: '500', label: '500' },
                                { value: '600', label: '600' },
                                { value: '700', label: '700' },
                                { value: '800', label: '800' },
                                { value: '900', label: '900' },
                            ]}
                        />
                    </div>
                );

            case 'H02': // heading-divided
                return (
                    <div className='space-y-3'>
                        <CheckboxField
                            label='顯示底線'
                            checked={(style.underline as boolean) ?? true}
                            onChange={value =>
                                onUpdateStyle(component.id, {
                                    ...style,
                                    underline: value,
                                })
                            }
                        />
                    </div>
                );

            case 'I01': // image-simple
                return (
                    <div className='space-y-3'>
                        <TextField
                            label='寬度'
                            value={(style.width as string) || '100%'}
                            onChange={value =>
                                onUpdateStyle(component.id, { ...style, width: value })
                            }
                            placeholder='e.g. 100%, 300px'
                        />

                        <TextField
                            label='高度'
                            value={(style.height as string) || 'auto'}
                            onChange={value =>
                                onUpdateStyle(component.id, { ...style, height: value })
                            }
                            placeholder='e.g. auto, 200px'
                        />

                        <TextField
                            label='圓角'
                            value={(style.borderRadius as string) || '8px'}
                            onChange={value =>
                                onUpdateStyle(component.id, {
                                    ...style,
                                    borderRadius: value,
                                })
                            }
                            placeholder='e.g. 8px'
                        />

                        <SelectField
                            label='填充模式'
                            value={(style.objectFit as string) || 'cover'}
                            onChange={value =>
                                onUpdateStyle(component.id, {
                                    ...style,
                                    objectFit: value,
                                })
                            }
                            options={[
                                { value: 'cover', label: 'Cover' },
                                { value: 'contain', label: 'Contain' },
                                { value: 'fill', label: 'Fill' },
                                { value: 'none', label: 'None' },
                                { value: 'scale-down', label: 'Scale Down' },
                            ]}
                        />
                    </div>
                );

            default:
                return <div className='text-xs text-zinc-400'>無可編輯樣式</div>;
        }
    };

    return (
        <div className='flex flex-col h-full'>
            {/* Header */}
            <div className='px-4 py-3 border-b border-zinc-200'>
                <div className='flex items-center justify-between mb-1'>
                    <h3 className='text-sm font-bold text-zinc-800'>
                        編輯元件
                    </h3>
                    <button
                        onClick={onDeselect}
                        className='text-zinc-400 hover:text-zinc-600 transition-colors'
                        title='關閉'
                    >
                        ✕
                    </button>
                </div>
                <p className='text-xs text-zinc-500'>{component.label}</p>
            </div>

            {/* 內容 */}
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {/* 資料區塊 */}
                <div>
                    <AccordionHeader
                        label='資料設定'
                        open={dataOpen}
                        onToggle={() => setDataOpen(!dataOpen)}
                    />
                    {dataOpen && (
                        <div className='mt-3 pl-4'>{renderDataFields()}</div>
                    )}
                </div>

                {/* 樣式區塊 */}
                <div>
                    <AccordionHeader
                        label='樣式設定'
                        open={styleOpen}
                        onToggle={() => setStyleOpen(!styleOpen)}
                    />
                    {styleOpen && (
                        <div className='mt-3 pl-4'>{renderStyleFields()}</div>
                    )}
                </div>
            </div>
        </div>
    );
}

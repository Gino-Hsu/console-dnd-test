'use client';

import { useState } from 'react';
import {
    TextField,
    SelectField,
    ColorField,
    NumberField,
} from '../../../common/FormFields';
import { Accordion } from '../../../common/Accordion';
import type { InspectorProps } from '../types';

/**
 * H01: heading-simple 編輯區
 */
export default function HeadingSimpleInspector({
    data,
    style,
    onUpdateData,
    onUpdateStyle,
}: InspectorProps) {
    const [dataOpen, setDataOpen] = useState(true);
    const [styleOpen, setStyleOpen] = useState(true);

    return (
        <div className="space-y-3">
            <Accordion
                header="資料設定"
                open={dataOpen}
                onToggle={() => setDataOpen(!dataOpen)}
            >
                <div className="space-y-3">
                <TextField
                    label="標題"
                    value={(data.title as string) || ''}
                    onChange={(value) =>
                        onUpdateData({ ...data, title: value })
                    }
                />

                <SelectField
                    label="層級"
                    value={(data.level as string) || 'h2'}
                    onChange={(value) =>
                        onUpdateData({ ...data, level: value })
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
                </div>
            </Accordion>

            <Accordion
                header="樣式設定"
                open={styleOpen}
                onToggle={() => setStyleOpen(!styleOpen)}
            >
                <div className="space-y-3">
                <SelectField
                    label="對齊方式"
                    value={(style.align as string) || 'left'}
                    onChange={(value) =>
                        onUpdateStyle({ ...style, align: value })
                    }
                    options={[
                        { value: 'left', label: '靠左' },
                        { value: 'center', label: '置中' },
                        { value: 'right', label: '靠右' },
                    ]}
                />

                <ColorField
                    label="顏色"
                    value={(style.color as string) || '#000000'}
                    onChange={(value) =>
                        onUpdateStyle({ ...style, color: value })
                    }
                />

                <NumberField
                    label="字體大小 (px)"
                    value={(style.fontSize as number) || 24}
                    onChange={(value) =>
                        onUpdateStyle({ ...style, fontSize: value })
                    }
                    min={8}
                    max={120}
                />

                <SelectField
                    label="字重"
                    value={(style.fontWeight as string) || 'normal'}
                    onChange={(value) =>
                        onUpdateStyle({ ...style, fontWeight: value })
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
            </Accordion>
        </div>
    );
}

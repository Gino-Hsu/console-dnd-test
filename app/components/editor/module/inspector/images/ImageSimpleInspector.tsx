'use client';

import { useState } from 'react';
import { TextField, SelectField } from '../../../common/FormFields';
import { RadioWithInput } from '../../../common/RadioWithInput';
import { Accordion } from '../../../common/Accordion';
import type { InspectorProps } from '../types';

/**
 * I01: image-simple 編輯區
 */
export default function ImageSimpleInspector({
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
                    label="圖片 URL"
                    value={(data.src as string) || ''}
                    onChange={(value) => onUpdateData({ ...data, src: value })}
                />

                <TextField
                    label="替代文字"
                    value={(data.alt as string) || ''}
                    onChange={(value) => onUpdateData({ ...data, alt: value })}
                />
                </div>
            </Accordion>

            <Accordion
                header="樣式設定"
                open={styleOpen}
                onToggle={() => setStyleOpen(!styleOpen)}
            >
                <div className="space-y-3">
                <TextField
                    label="寬度"
                    value={(style.width as string) || '100%'}
                    onChange={(value) =>
                        onUpdateStyle({ ...style, width: value })
                    }
                    placeholder="e.g. 100%, 300px"
                />

                <RadioWithInput
                    label="高度"
                    value={(style.height as string) || 'auto'}
                    onChange={(value) => onUpdateStyle({ ...style, height: value })}
                    options={[
                        { value: 'auto', label: '自動高度 (auto)' },
                        { value: 'custom', label: '固定高度 (px)', hasInput: true },
                    ]}
                    unit="px"
                    placeholder="200"
                />

                <TextField
                    label="圓角"
                    value={(style.borderRadius as string) || '8px'}
                    onChange={(value) =>
                        onUpdateStyle({ ...style, borderRadius: value })
                    }
                    placeholder="e.g. 8px"
                />

                <SelectField
                    label="填充模式"
                    value={(style.objectFit as string) || 'cover'}
                    onChange={(value) =>
                        onUpdateStyle({ ...style, objectFit: value })
                    }
                    options={[
                        { value: 'cover', label: '覆蓋填滿 (Cover)' },
                        { value: 'contain', label: '完整顯示 (Contain)' },
                        { value: 'fill', label: '拉伸填充 (Fill)' },
                        { value: 'none', label: '原始尺寸 (None)' },
                        { value: 'scale-down', label: '縮小適應 (Scale Down)' },
                    ]}
                />
                </div>
            </Accordion>
        </div>
    );
}

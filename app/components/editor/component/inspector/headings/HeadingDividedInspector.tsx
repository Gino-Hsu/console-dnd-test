'use client';

import { useState } from 'react';
import {
    TextField,
    SelectField,
    CheckboxField,
} from '../../../common/FormFields';
import { Accordion } from '../../../common/Accordion';
import type { InspectorProps } from '../types';

/**
 * H02: heading-divided 編輯區
 */
export default function HeadingDividedInspector({
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

                <TextField
                    label="說明文字"
                    value={(data.description as string) || ''}
                    onChange={(value) =>
                        onUpdateData({ ...data, description: value })
                    }
                />
                </div>
            </Accordion>

            <Accordion
                header="樣式設定"
                open={styleOpen}
                onToggle={() => setStyleOpen(!styleOpen)}
            >
                <div className="space-y-3">
                <CheckboxField
                    label="顯示底線"
                    checked={(style.underline as boolean) ?? true}
                    onChange={(value) =>
                        onUpdateStyle({ ...style, underline: value })
                    }
                />
                </div>
            </Accordion>
        </div>
    );
}

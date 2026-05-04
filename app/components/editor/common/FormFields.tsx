/* ── 共用表單欄位元件 ─────────────────────────── */

interface LabelProps {
    children: React.ReactNode;
}

function FieldLabel({ children }: LabelProps) {
    return (
        <label className='block text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-1'>
            {children}
        </label>
    );
}

interface TextFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'number';
    min?: number;
    max?: number;
}

export function TextField({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    min,
    max,
}: TextFieldProps) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                min={min}
                max={max}
                className='w-full text-sm border border-zinc-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400'
            />
        </div>
    );
}

interface NumberFieldProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export function NumberField({
    label,
    value,
    onChange,
    min,
    max,
}: NumberFieldProps) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <input
                type='number'
                value={value}
                onChange={e => onChange(parseInt(e.target.value, 10) || 0)}
                min={min}
                max={max}
                className='w-full text-sm border border-zinc-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400'
            />
        </div>
    );
}

interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
}

export function SelectField({
    label,
    value,
    onChange,
    options,
}: SelectFieldProps) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className='w-full text-sm border border-zinc-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400'
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

interface CheckboxFieldProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export function CheckboxField({
    label,
    checked,
    onChange,
}: CheckboxFieldProps) {
    return (
        <div>
            <label className='flex items-center gap-2 text-sm text-zinc-700'>
                <input
                    type='checkbox'
                    checked={checked}
                    onChange={e => onChange(e.target.checked)}
                    className='w-4 h-4'
                />
                {label}
            </label>
        </div>
    );
}

interface ColorFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <div className='flex gap-2'>
                <input
                    type='color'
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className='w-12 h-8 border border-zinc-200 rounded cursor-pointer'
                />
                <input
                    type='text'
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className='flex-1 text-sm border border-zinc-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400'
                />
            </div>
        </div>
    );
}

/* ── 共用表單欄位元件 ─────────────────────────── */

interface LabelProps {
  children: React.ReactNode;
}

function FieldLabel({ children }: LabelProps) {
  return (
    <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-1">
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
        className="w-full text-sm border border-zinc-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
      />
    </div>
  );
}

interface NumberFieldProps {
  label?: string;
  underLabel?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function NumberField({
  label,
  underLabel,
  value,
  onChange,
  min,
  max,
}: NumberFieldProps) {
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <input
        type="number"
        value={value}
        onChange={e => onChange(parseInt(e.target.value, 10) || 0)}
        min={min}
        max={max}
        className="w-full text-sm border border-zinc-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
      />
      {underLabel && (
        <p className="text-[10px] text-zinc-400 mt-0.5">{underLabel}</p>
      )}
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
        className="w-full text-sm border border-zinc-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
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
      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="w-4 h-4"
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
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-12 h-8 border border-zinc-200 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 text-sm border border-zinc-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
        />
      </div>
    </div>
  );
}

export interface RadioFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  direction?: 'row' | 'col';
}

export function RadioField({
  label,
  value,
  onChange,
  options,
  direction = 'row',
}: RadioFieldProps) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div
        className={`flex mt-1.5 ${
          direction === 'col' ? 'flex-col gap-2' : 'items-center gap-4'
        }`}
      >
        {options.map(opt => (
          <label
            key={opt.value}
            className="flex items-center gap-1.5 text-sm text-zinc-700 cursor-pointer"
          >
            <input
              type="radio"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="w-3.5 h-3.5 accent-blue-500 cursor-pointer"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

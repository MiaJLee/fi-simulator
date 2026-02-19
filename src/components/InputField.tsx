interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  unit: string;
  inputMode?: 'numeric' | 'decimal';
  fullWidth?: boolean;
}

export default function InputField({ label, value, onChange, placeholder, unit, inputMode = 'numeric', fullWidth }: InputFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5${fullWidth ? ' col-span-2' : ''}`}>
      <label className="text-[13px] font-medium text-text-secondary">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          className="w-full py-[11px] pl-[14px] pr-[44px] bg-bg-secondary border border-border-default rounded-[9px] text-text-primary font-mono text-sm font-medium outline-none transition-[border-color,box-shadow] duration-200 focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(74,143,166,0.15)]"
        />
        <span className="absolute right-[14px] text-xs font-medium text-text-muted pointer-events-none">
          {unit}
        </span>
      </div>
    </div>
  );
}

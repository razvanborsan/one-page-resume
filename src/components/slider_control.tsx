import type {ChangeEvent} from 'react';

export interface SliderControlProps {
  label: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  tooltip?: string;
  valueWidth?: string;
}

export function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format = String,
  tooltip,
  valueWidth = 'w-14',
}: SliderControlProps) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <p className="text-xs text-neutral-500 uppercase tracking-widest">
          {label}
        </p>
        {tooltip && (
          <span className="relative group/tip">
            <span className="w-3.5 h-3.5 rounded-full border border-neutral-600 text-neutral-500 text-[9px] font-medium flex items-center justify-center cursor-default">
              i
            </span>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 text-xs text-neutral-300 bg-neutral-800 border border-neutral-700 rounded-md w-48 opacity-0 pointer-events-none group-hover/tip:opacity-100 transition-opacity">
              {tooltip}
            </span>
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="flex-1 h-1 accent-white"
        />
        <span
          className={`text-sm font-mono tabular-nums ${valueWidth} text-right`}
        >
          {format(value)}
        </span>
      </div>
    </div>
  );
}

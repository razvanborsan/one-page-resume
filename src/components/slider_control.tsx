import {
  Slider,
  SliderTrack,
  SliderThumb,
  SliderOutput,
  Label,
  Button,
  TooltipTrigger,
  Tooltip,
} from 'react-aria-components';

export interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
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
  onChangeEnd,
  min,
  max,
  step,
  format = String,
  tooltip,
  valueWidth = 'w-14',
}: SliderControlProps) {
  return (
    <Slider
      aria-label={label}
      value={value}
      onChange={onChange}
      onChangeEnd={onChangeEnd}
      minValue={min}
      maxValue={max}
      step={step}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <Label className="text-xs text-neutral-500 uppercase tracking-widest">
          {label}
        </Label>
        {tooltip && (
          <TooltipTrigger delay={200} closeDelay={0}>
            <Button className="w-3.5 h-3.5 rounded-full border border-neutral-600 text-neutral-500 text-[9px] font-medium flex items-center justify-center cursor-default outline-none data-focus-visible:ring-1 data-focus-visible:ring-white/60">
              i
            </Button>
            <Tooltip
              offset={6}
              className="max-w-48 px-2.5 py-1.5 text-xs text-neutral-300 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg"
            >
              {tooltip}
            </Tooltip>
          </TooltipTrigger>
        )}
      </div>
      <div className="flex items-center gap-3">
        <SliderTrack className="relative flex-1 h-4 flex items-center">
          {({state}) => (
            <>
              <div className="absolute h-1 w-full rounded-full bg-neutral-700" />
              <div
                className="absolute h-1 rounded-full bg-white"
                style={{width: `${state.getThumbPercent(0) * 100}%`}}
              />
              <SliderThumb
                aria-label={label}
                className="top-[50%] h-3 w-3 rounded-full bg-white border border-neutral-300 shadow outline-none transition data-dragging:scale-110 data-focus-visible:ring-2 data-focus-visible:ring-white/60"
              />
            </>
          )}
        </SliderTrack>
        <SliderOutput
          className={`text-sm font-mono tabular-nums ${valueWidth} text-right`}
        >
          {format(value)}
        </SliderOutput>
      </div>
    </Slider>
  );
}

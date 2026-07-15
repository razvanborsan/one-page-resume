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

import {cn} from '../lib/utils';

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
      className="block"
    >
      <div className="mb-[0.2rem] flex min-h-5 items-center gap-[0.3rem]">
        <Label className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.7rem] text-ink-68">
          {label}
        </Label>
        {tooltip && (
          <TooltipTrigger delay={200} closeDelay={0}>
            <Button className="grid size-[0.9rem] place-items-center rounded-full border border-white/18 bg-transparent p-0 text-[0.55rem] text-ink-52 outline-none focus-visible:shadow-[0_0_0_2px_oklch(1_0_0/36%)]">
              i
            </Button>
            <Tooltip
              offset={6}
              className="max-w-52 rounded-lg border border-white/10 bg-panel-tooltip px-[0.6rem] py-[0.45rem] text-[0.68rem] leading-[1.4] text-[oklch(0.82_0_0)] shadow-[0_10px_28px_oklch(0_0_0/22%)]"
            >
              {tooltip}
            </Tooltip>
          </TooltipTrigger>
        )}
        <SliderOutput
          className={cn(
            'ml-auto min-w-[3.3rem] whitespace-nowrap text-right font-mono text-[0.66rem] tabular-nums text-ink-90',
            valueWidth,
          )}
        >
          {format(value)}
        </SliderOutput>
      </div>
      <SliderTrack className="relative flex h-[1.1rem] items-center">
        {({state}) => (
          <>
            <div className="absolute h-[0.18rem] w-full rounded-full bg-white/14" />
            <div
              className="absolute h-[0.18rem] rounded-full bg-ink-90"
              style={{width: `${state.getThumbPercent(0) * 100}%`}}
            />
            <SliderThumb
              aria-label={label}
              className="top-1/2 size-[0.7rem] rounded-full border-2 border-[oklch(0.92_0_0)] bg-[oklch(0.28_0_0)] shadow-[0_1px_3px_oklch(0_0_0/40%)] outline-none transition-[width,height,box-shadow] duration-100 dragging:size-[0.8rem] focus-visible:shadow-[0_0_0_3px_oklch(1_0_0/24%)]"
            />
          </>
        )}
      </SliderTrack>
    </Slider>
  );
}

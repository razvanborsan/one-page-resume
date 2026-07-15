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
      className="slider-control"
    >
      <div className="slider-label-row">
        <Label className="slider-label">{label}</Label>
        {tooltip && (
          <TooltipTrigger delay={200} closeDelay={0}>
            <Button className="slider-info-button">i</Button>
            <Tooltip offset={6} className="control-tooltip">
              {tooltip}
            </Tooltip>
          </TooltipTrigger>
        )}
        <SliderOutput className={`slider-output ${valueWidth}`}>
          {format(value)}
        </SliderOutput>
      </div>
      <SliderTrack className="slider-track">
        {({state}) => (
          <>
            <div className="slider-track-background" />
            <div
              className="slider-track-fill"
              style={{width: `${state.getThumbPercent(0) * 100}%`}}
            />
            <SliderThumb aria-label={label} className="slider-thumb" />
          </>
        )}
      </SliderTrack>
    </Slider>
  );
}

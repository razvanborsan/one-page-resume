import {
  Button,
  Label,
  Link,
  Meter,
  SwitchButton,
  SwitchField,
} from 'react-aria-components';

import {LINE_HEIGHT_MAX, LINE_HEIGHT_MIN} from '../lib/page';
import type {LayoutSettingKey} from '../lib/resume_settings';
import {SliderControl} from './slider_control';

interface SettingsPanelValues {
  autoFit: boolean;
  fontSize: number;
  itemSpacing: number;
  lineHeightMultiplier: number;
  maxFontSize: number;
  padding: number;
  sectionSpacing: number;
  separatorSpacing: number;
}

interface SettingsPanelProps {
  active: boolean;
  fillPercent: number;
  fits: boolean;
  maxContentHeight: number;
  measuredHeight: number;
  measureTime: number;
  onAutoFitChange: (selected: boolean) => void;
  onExport: () => void;
  onFontSizeChange: (value: number) => void;
  onLayoutChange: (key: LayoutSettingKey, value: number) => void;
  onLayoutChangeEnd: () => void;
  onLineHeightChange: (value: number) => void;
  onShuffle: () => void;
  values: SettingsPanelValues;
}

export function SettingsPanel({
  active,
  fillPercent,
  fits,
  maxContentHeight,
  measuredHeight,
  measureTime,
  onAutoFitChange,
  onExport,
  onFontSizeChange,
  onLayoutChange,
  onLayoutChangeEnd,
  onLineHeightChange,
  onShuffle,
  values,
}: SettingsPanelProps) {
  return (
    <div
      className={`w-full sm:w-72 sm:shrink-0 self-stretch sm:border-l border-neutral-800 px-5 py-4 flex-col gap-4 overflow-y-auto ${active ? 'flex' : 'hidden'} sm:flex`}
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold tracking-tight">One Page Resume</h1>
          <Link
            href="https://github.com/razvanborsan/one-page-resume"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="text-neutral-500 hover:text-white transition-colors outline-none rounded data-focus-visible:ring-2 data-focus-visible:ring-white/60"
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </Link>
        </div>
        <div className="text-neutral-400 text-sm leading-relaxed space-y-2">
          <p>
            A resume builder using semantic Markdown and browser-accurate page
            fitting.
          </p>
          <p>
            Write markdown on the left. The preview auto-scales{' '}
            <span className="font-semibold text-neutral-300">font size</span>{' '}
            and{' '}
            <span className="font-semibold text-neutral-300">line spacing</span>{' '}
            to fit everything on one A4 page.
          </p>
          <p className="text-xs text-neutral-500">
            Forked from{' '}
            <Link
              href="https://github.com/vladartym/always-fit-resume"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-neutral-300 transition-colors cursor-pointer outline-none rounded data-focus-visible:ring-2 data-focus-visible:ring-white/60"
            >
              always-fit-resume
            </Link>{' '}
            by Vlad Artym.
          </p>
        </div>
        <Button
          onPress={onShuffle}
          className="mt-3 w-full px-3 py-2 text-sm font-medium border border-neutral-700 text-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-800 hover:text-white transition-colors outline-none data-focus-visible:ring-2 data-focus-visible:ring-white/60"
        >
          Shuffle Resume
        </Button>
      </div>

      <SwitchField isSelected={values.autoFit} onChange={onAutoFitChange}>
        <SwitchButton className="group flex w-full items-center justify-between cursor-pointer">
          <span className="text-xs text-neutral-500 uppercase tracking-widest">
            Auto-fit
          </span>
          <span className="w-10 h-5 rounded-full bg-neutral-700 group-data-selected:bg-emerald-500 transition-colors relative shrink-0 group-data-focus-visible:ring-2 group-data-focus-visible:ring-white/60 group-data-focus-visible:ring-offset-2 group-data-focus-visible:ring-offset-neutral-900">
            <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform group-data-selected:translate-x-5" />
          </span>
        </SwitchButton>
      </SwitchField>

      <SliderControl
        label="Max Font Size"
        value={values.maxFontSize}
        onChange={value => onLayoutChange('maxFontSize', value)}
        onChangeEnd={onLayoutChangeEnd}
        min={8}
        max={24}
        step={0.5}
        format={value => `${value}px`}
        valueWidth="w-16"
      />

      <SliderControl
        label="Font Scale"
        value={values.fontSize}
        onChange={onFontSizeChange}
        min={6}
        max={24}
        step={0.01}
        format={value => `${((value / 16) * 100).toFixed(1)}%`}
        valueWidth="w-16"
      />

      <SliderControl
        label="Line Spacing"
        value={values.lineHeightMultiplier}
        onChange={onLineHeightChange}
        min={LINE_HEIGHT_MIN}
        max={LINE_HEIGHT_MAX}
        step={0.001}
        format={value => `${value.toFixed(2)}x`}
      />

      <SliderControl
        label="Page Margin"
        value={values.padding}
        onChange={value => onLayoutChange('padding', value)}
        onChangeEnd={onLayoutChangeEnd}
        min={16}
        max={80}
        step={1}
        format={value => `${value}px`}
      />

      <SliderControl
        label="Section Spacing"
        value={values.sectionSpacing}
        onChange={value => onLayoutChange('sectionSpacing', value)}
        onChangeEnd={onLayoutChangeEnd}
        min={0}
        max={48}
        step={1}
        format={value => `${value}px`}
        tooltip="Gap before section headers like Experience, Education, and Skills."
      />

      <SliderControl
        label="Item Spacing"
        value={values.itemSpacing}
        onChange={value => onLayoutChange('itemSpacing', value)}
        onChangeEnd={onLayoutChangeEnd}
        min={0}
        max={30}
        step={1}
        format={value => `${value}px`}
        tooltip="Gap between entries within a section, like between different jobs or degrees."
      />

      <SliderControl
        label="Separator Spacing"
        value={values.separatorSpacing}
        onChange={value => onLayoutChange('separatorSpacing', value)}
        onChangeEnd={onLayoutChangeEnd}
        min={0}
        max={30}
        step={1}
        format={value => `${value}px`}
        tooltip="Padding above and below the horizontal rule divider."
      />

      <Meter value={fillPercent}>
        <Label className="block text-xs text-neutral-500 uppercase tracking-widest mb-1.5">
          Page Fit
        </Label>
        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${fillPercent}%`,
              backgroundColor: fits
                ? 'rgb(52, 211, 153)'
                : 'rgb(248, 113, 113)',
            }}
          />
        </div>
        <div className="flex items-baseline justify-between text-xs">
          <span
            className={`font-medium ${fits ? 'text-emerald-400' : 'text-red-400'}`}
          >
            {fits
              ? 'Fits on 1 page'
              : `Overflow +${measuredHeight - maxContentHeight}px`}
          </span>
          <span className="text-neutral-600 font-mono tabular-nums">
            {measuredHeight}/{maxContentHeight}px · {measureTime}ms
          </span>
        </div>
      </Meter>

      <Button
        onPress={onExport}
        className="mt-auto w-full px-3 py-2 text-sm font-medium bg-white text-neutral-900 rounded-lg cursor-pointer hover:bg-neutral-200 transition-colors outline-none data-focus-visible:ring-2 data-focus-visible:ring-white/60 data-focus-visible:ring-offset-2 data-focus-visible:ring-offset-neutral-900"
      >
        Export as PDF
      </Button>
    </div>
  );
}

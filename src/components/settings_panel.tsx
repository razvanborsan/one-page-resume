import {
  Button,
  Disclosure,
  DisclosurePanel,
  Heading,
  Label,
  Meter,
  SwitchButton,
  SwitchField,
} from 'react-aria-components';
import type {ReactNode} from 'react';

import {LINE_HEIGHT_MAX, LINE_HEIGHT_MIN} from '../lib/page';
import type {LayoutSettingKey} from '../lib/resume_settings';
import {cn} from '../lib/utils';
import {ChevronRightIcon, CloseIcon} from './icons';
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
  fillPercent: number;
  fits: boolean;
  maxContentHeight: number;
  measuredHeight: number;
  onAutoFitChange: (selected: boolean) => void;
  onClose?: () => void;
  onFontSizeChange: (value: number) => void;
  onLayoutChange: (key: LayoutSettingKey, value: number) => void;
  onLayoutChangeEnd: () => void;
  onLineHeightChange: (value: number) => void;
  onReset: () => void;
  values: SettingsPanelValues;
}

const SHORT_VIEWPORT = '[@media(max-height:42rem)and(min-width:75rem)]:';

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Disclosure
      defaultExpanded
      className="group/disc border-b border-white/8 last:border-b-0"
    >
      <Heading className="m-0">
        <Button
          slot="trigger"
          className={`flex h-10 w-full cursor-pointer items-center gap-[0.4rem] rounded-[0.4rem] border-0 bg-transparent p-0 text-[0.66rem] font-[640] uppercase tracking-[0.08em] text-ink-62 outline-none hovered:text-ink-90 focus-visible:shadow-[0_0_0_2px_oklch(1_0_0/36%)] ${SHORT_VIEWPORT}h-8`}
        >
          <ChevronRightIcon className="size-3 transition-transform duration-150 group-data-[expanded]/disc:rotate-90" />
          {title}
        </Button>
      </Heading>
      <DisclosurePanel
        className={`grid gap-[0.8rem] px-[0.05rem] pb-[0.9rem] ${SHORT_VIEWPORT}gap-2 ${SHORT_VIEWPORT}pb-[0.6rem]`}
      >
        {children}
      </DisclosurePanel>
    </Disclosure>
  );
}

export function SettingsPanel({
  fillPercent,
  fits,
  maxContentHeight,
  measuredHeight,
  onAutoFitChange,
  onClose,
  onFontSizeChange,
  onLayoutChange,
  onLayoutChangeEnd,
  onLineHeightChange,
  onReset,
  values,
}: SettingsPanelProps) {
  const overflow = Math.max(0, measuredHeight - maxContentHeight);
  const inDialog = Boolean(onClose);

  return (
    <aside
      className={cn(
        'flex min-w-0 min-h-0 flex-col overflow-hidden rounded-panel border border-white/8 bg-panel text-ink-94 shadow-[0_20px_50px_oklch(0_0_0/14%),inset_0_1px_0_oklch(1_0_0/4%)] backdrop-blur-[20px]',
        inDialog ? 'h-full self-stretch' : 'h-auto max-h-full self-start',
      )}
      aria-label="Resume style settings"
    >
      <div className="flex min-h-[3.6rem] shrink-0 grow-0 items-center justify-between gap-3 border-b border-white/8 px-[0.85rem] py-[0.7rem]">
        <div>
          <span className="mb-[0.05rem] block text-[0.64rem] font-[620] uppercase leading-[1.2] tracking-[0.11em] text-ink-52">
            Resume
          </span>
          <h2 className="m-0 text-[0.9rem] font-[630] tracking-[-0.01em]">
            Style
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <Button
            className="h-7 cursor-pointer rounded-lg border-0 bg-transparent px-[0.45rem] text-[0.68rem] font-[560] text-ink-58 outline-none hovered:bg-white/8 hovered:text-white focus-visible:shadow-[0_0_0_2px_oklch(1_0_0/36%)]"
            onPress={onReset}
          >
            Reset
          </Button>
          {onClose && (
            <Button
              className="grid size-7 cursor-pointer place-items-center rounded-lg border-0 bg-transparent p-0 text-ink-58 outline-none hovered:bg-white/8 hovered:text-white focus-visible:shadow-[0_0_0_2px_oklch(1_0_0/36%)]"
              aria-label="Close style settings"
              onPress={onClose}
            >
              <CloseIcon className="size-[0.9rem]" />
            </Button>
          )}
        </div>
      </div>

      <div
        className={cn(
          `app-scrollbar-inverted min-h-0 overflow-y-auto p-3 ${SHORT_VIEWPORT}py-[0.55rem]`,
          inDialog ? 'flex-1' : 'shrink grow-0',
        )}
      >
        <section
          className="border-b border-white/8 px-[0.1rem] pt-[0.1rem] pb-[0.8rem]"
          aria-labelledby="fit-heading"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 id="fit-heading" className="m-0 text-xs font-[620]">
              Auto-fit
            </h3>
            <SwitchField isSelected={values.autoFit} onChange={onAutoFitChange}>
              <SwitchButton className="group/switch block cursor-pointer rounded-full border-0 bg-transparent p-0 outline-none focus-visible:shadow-[0_0_0_2px_oklch(1_0_0/36%)]">
                <span className="pointer-events-none relative block h-[1.1rem] w-8 rounded-full bg-[oklch(0.34_0_0)] transition-[background-color] duration-150 group-data-[selected]/switch:bg-app-success">
                  <span className="absolute left-[0.15rem] top-[0.15rem] size-[0.8rem] rounded-full bg-white shadow-[0_1px_3px_oklch(0_0_0/30%)] transition-transform duration-150 group-data-[selected]/switch:translate-x-[0.9rem]" />
                </span>
              </SwitchButton>
            </SwitchField>
          </div>
          <p
            className={`mt-[0.35rem] mb-3 text-[0.68rem] leading-[1.45] text-ink-58 ${SHORT_VIEWPORT}hidden`}
          >
            {values.autoFit
              ? 'Balances text size and line height to keep the resume on one page.'
              : 'Manual type controls are active.'}
          </p>

          <Meter value={fillPercent}>
            <div className="mb-[0.35rem] flex items-center justify-between gap-3 text-[0.64rem] font-[560] text-[oklch(0.54_0_0)]">
              <Label>Page fill</Label>
              <span className="font-mono tabular-nums">
                {Math.round(fillPercent)}%
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/9">
              <div
                className="h-full rounded-[inherit] bg-app-danger transition-[width] duration-100 ease-linear data-[fits=true]:bg-app-success"
                data-fits={fits}
                style={{width: `${fillPercent}%`}}
              />
            </div>
            <span
              className="mt-[0.4rem] block text-[0.65rem] font-[560] text-[oklch(0.74_0.13_25)] data-[fits=true]:text-[oklch(0.74_0.13_160)]"
              data-fits={fits}
            >
              {fits ? 'Fits on 1 page' : `Overflow by ${overflow}px`}
            </span>
          </Meter>
        </section>

        <SettingsSection title="Typography">
          {values.autoFit ? (
            <>
              <SliderControl
                label="Maximum text size"
                value={values.maxFontSize}
                onChange={value => onLayoutChange('maxFontSize', value)}
                onChangeEnd={onLayoutChangeEnd}
                min={8}
                max={24}
                step={0.5}
                format={value => `${value}px`}
              />
              <div className="flex items-center justify-between gap-3 rounded-[0.55rem] border border-white/8 bg-white/4 px-[0.55rem] py-2 text-[0.64rem] text-ink-52">
                <span>Calculated</span>
                <span className="whitespace-nowrap font-mono tabular-nums text-ink-76">
                  {values.fontSize.toFixed(2)}px ·{' '}
                  {values.lineHeightMultiplier.toFixed(2)} line
                </span>
              </div>
            </>
          ) : (
            <>
              <SliderControl
                label="Text size"
                value={values.fontSize}
                onChange={onFontSizeChange}
                min={6}
                max={24}
                step={0.01}
                format={value => `${value.toFixed(2)}px`}
              />
              <SliderControl
                label="Line height"
                value={values.lineHeightMultiplier}
                onChange={onLineHeightChange}
                min={LINE_HEIGHT_MIN}
                max={LINE_HEIGHT_MAX}
                step={0.001}
                format={value => value.toFixed(2)}
              />
            </>
          )}
        </SettingsSection>

        <SettingsSection title="Spacing">
          <SliderControl
            label="Margins"
            value={values.padding}
            onChange={value => onLayoutChange('padding', value)}
            onChangeEnd={onLayoutChangeEnd}
            min={16}
            max={80}
            step={1}
            format={value => `${value}px`}
          />
          <SliderControl
            label="Sections"
            value={values.sectionSpacing}
            onChange={value => onLayoutChange('sectionSpacing', value)}
            onChangeEnd={onLayoutChangeEnd}
            min={0}
            max={48}
            step={1}
            format={value => `${value}px`}
          />
          <SliderControl
            label="Entries"
            value={values.itemSpacing}
            onChange={value => onLayoutChange('itemSpacing', value)}
            onChangeEnd={onLayoutChangeEnd}
            min={0}
            max={30}
            step={1}
            format={value => `${value}px`}
          />
          <SliderControl
            label="Dividers"
            value={values.separatorSpacing}
            onChange={value => onLayoutChange('separatorSpacing', value)}
            onChangeEnd={onLayoutChangeEnd}
            min={0}
            max={30}
            step={1}
            format={value => `${value}px`}
          />
        </SettingsSection>
      </div>
    </aside>
  );
}

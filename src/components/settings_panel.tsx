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

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Disclosure defaultExpanded className="settings-disclosure">
      <Heading className="settings-disclosure-heading">
        <Button slot="trigger" className="settings-disclosure-trigger">
          <ChevronRightIcon className="disclosure-chevron" />
          {title}
        </Button>
      </Heading>
      <DisclosurePanel className="settings-disclosure-panel">
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

  return (
    <aside className="style-panel" aria-label="Resume style settings">
      <div className="style-panel-header">
        <div>
          <span className="style-panel-eyebrow">Resume</span>
          <h2 className="style-panel-title">Style</h2>
        </div>
        <div className="style-panel-header-actions">
          <Button className="style-reset-button" onPress={onReset}>
            Reset
          </Button>
          {onClose && (
            <Button
              className="style-close-button"
              aria-label="Close style settings"
              onPress={onClose}
            >
              <CloseIcon />
            </Button>
          )}
        </div>
      </div>

      <div className="style-panel-content app-scrollbar">
        <section className="fit-section" aria-labelledby="fit-heading">
          <div className="fit-section-heading">
            <h3 id="fit-heading">Auto-fit</h3>
            <SwitchField isSelected={values.autoFit} onChange={onAutoFitChange}>
              <SwitchButton className="switch-control">
                <span className="switch-track">
                  <span className="switch-thumb" />
                </span>
              </SwitchButton>
            </SwitchField>
          </div>
          <p className="fit-section-description">
            {values.autoFit
              ? 'Balances text size and line height to keep the resume on one page.'
              : 'Manual type controls are active.'}
          </p>

          <Meter className="fit-meter" value={fillPercent}>
            <div className="fit-meter-labels">
              <Label>Page fill</Label>
              <span>{Math.round(fillPercent)}%</span>
            </div>
            <div className="fit-meter-track">
              <div
                className="fit-meter-fill"
                data-fits={fits}
                style={{width: `${fillPercent}%`}}
              />
            </div>
            <span className="fit-meter-status" data-fits={fits}>
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
              <div className="calculated-type-row">
                <span>Calculated</span>
                <span>
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
